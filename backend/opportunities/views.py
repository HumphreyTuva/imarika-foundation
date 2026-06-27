"""
opportunities/views.py
-----------------------
ViewSets and APIViews for the Opportunities module.

Endpoints registered via router (see urls.py):
  /api/opportunities/              — list (GET) / create (POST)
  /api/opportunities/<pk>/         — detail (GET) / update (PUT/PATCH) / delete (DELETE)
  /api/opportunities/<pk>/attachments/          — add attachments to an opportunity (POST)
  /api/opportunities/<pk>/attachments/<att_pk>/ — delete a specific attachment (DELETE)

Filtering  → django-filter via OpportunityFilter
Searching  → DRF SearchFilter on title, summary, description, reference_number
Ordering   → DRF OrderingFilter on deadline, publish_date, created_at
"""

from rest_framework import viewsets, status, filters
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.permissions import SAFE_METHODS
from rest_framework_simplejwt.authentication import JWTAuthentication

from django_filters.rest_framework import DjangoFilterBackend


class OptionalJWTAuthentication(JWTAuthentication):
    """Allow anonymous safe requests even when JWT headers are invalid."""

    def authenticate(self, request):
        if request.method in SAFE_METHODS:
            header = self.get_header(request)
            if header is None:
                return None
            raw_token = self.get_raw_token(header)
            if raw_token is None:
                return None
            try:
                return super().authenticate(request)
            except AuthenticationFailed:
                return None

        return super().authenticate(request)

from .models import Opportunity, OpportunityAttachment, OpportunityStatus
from .serializers import (
    OpportunityListSerializer,
    OpportunityDetailSerializer,
    OpportunityWriteSerializer,
    OpportunityAttachmentSerializer,
)
from .permissions import IsAdminOrReadOnly, IsStaffUser
from .filters import OpportunityFilter


class OpportunityViewSet(viewsets.ModelViewSet):
    """
    Full CRUD ViewSet for Opportunity.

    Read access  : open to all (anonymous users see non-draft, non-archived records).
    Write access : staff / admin only.

    Filtering examples:
        GET /api/opportunities/?opportunity_type=tender&status=open
        GET /api/opportunities/?location=Kilifi&is_featured=true
        GET /api/opportunities/?deadline_after=2026-01-01&deadline_before=2026-12-31
        GET /api/opportunities/?search=cassava
        GET /api/opportunities/?ordering=-deadline
    """

    permission_classes = [IsAdminOrReadOnly]
    authentication_classes = [OptionalJWTAuthentication, SessionAuthentication, BasicAuthentication]

    # Accept multipart (file uploads) as well as JSON
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    # ── Filtering, searching, ordering backends ──
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class   = OpportunityFilter
    search_fields     = ["title", "summary", "description", "reference_number"]
    ordering_fields   = ["deadline", "publish_date", "created_at"]
    ordering          = ["-is_featured", "-publish_date", "-created_at"]  # default

    # ── Queryset — public vs. staff ──
    def get_queryset(self):
        """
        Staff see ALL records (including draft / archived).
        Anonymous / regular users see only non-draft, non-archived records.
        """
        if self.request.user and self.request.user.is_staff:
            return Opportunity.objects.prefetch_related("attachments").all()

        return (
            Opportunity.objects
            .exclude(status__in=[OpportunityStatus.DRAFT, OpportunityStatus.ARCHIVED])
            .prefetch_related("attachments")
        )

    # ── Serializer selection ──
    def get_serializer_class(self):
        """
        - list action        → lightweight OpportunityListSerializer
        - retrieve action    → full OpportunityDetailSerializer
        - create/update      → OpportunityWriteSerializer
        """
        if self.action == "list":
            return OpportunityListSerializer
        if self.action == "retrieve":
            return OpportunityDetailSerializer
        return OpportunityWriteSerializer

    # ── Pass request context to serializers (needed for absolute URLs) ──
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    # ── Custom action: add attachment(s) to an existing opportunity ──
    @action(
        detail=True,
        methods=["post"],
        url_path="attachments",
        permission_classes=[IsStaffUser],
        parser_classes=[MultiPartParser, FormParser],
    )
    def add_attachment(self, request, pk=None):
        """
        POST /api/opportunities/<pk>/attachments/

        Upload one attachment at a time.
        Body (multipart/form-data):
          - title  : string
          - file   : file
        """
        opportunity = self.get_object()
        serializer = OpportunityAttachmentSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(opportunity=opportunity)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # ── Custom action: delete a specific attachment ──
    @action(
        detail=True,
        methods=["delete"],
        url_path=r"attachments/(?P<att_pk>\d+)",
        permission_classes=[IsStaffUser],
    )
    def delete_attachment(self, request, pk=None, att_pk=None):
        """
        DELETE /api/opportunities/<pk>/attachments/<att_pk>/

        Removes an attachment from an opportunity and deletes the file.
        """
        opportunity = self.get_object()
        try:
            attachment = opportunity.attachments.get(pk=att_pk)
        except OpportunityAttachment.DoesNotExist:
            return Response(
                {"detail": "Attachment not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        # Remove the actual file from storage before deleting the record
        attachment.file.delete(save=False)
        attachment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
