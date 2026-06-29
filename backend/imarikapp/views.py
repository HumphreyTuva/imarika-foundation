from datetime import date
from django.db import transaction
from rest_framework import viewsets, status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import BigStat, PillarStat, SuccessStory, Report,Leadership, Article, Event, EventImage, ContactMessage, Testimonial,SubProgram
from .serializers import (
    ArticleSerializer,
    EventSerializer,
    ContactMessageSerializer,
    TestimonialSerializer,
    LeadershipSerializer,
    SubProgramSerializer,
    BigStatSerializer,
    PillarStatSerializer, 
    SuccessStorySerializer,
    ReportSerializer,
)


class BigStatViewSet(viewsets.ModelViewSet):
    queryset = BigStat.objects.all()
    serializer_class = BigStatSerializer
    permission_classes = [AllowAny]

class PillarStatViewSet(viewsets.ModelViewSet):
    queryset = PillarStat.objects.all()
    serializer_class = PillarStatSerializer
    permission_classes = [AllowAny]

class SuccessStoryViewSet(viewsets.ModelViewSet):
    queryset = SuccessStory.objects.all()
    serializer_class = SuccessStorySerializer
    permission_classes = [AllowAny]

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [AllowAny]
####

# --- NEW ADMIN API ENDPOINT ---
class SubProgramViewSet(viewsets.ModelViewSet):
    queryset = SubProgram.objects.all()
    serializer_class = SubProgramSerializer
    permission_classes = [AllowAny] # WARNING: Change this to [IsAdminUser] before going live!

class ProgramsDataView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        programs = SubProgram.objects.all()
        
        # Group them by pillar slug so React can easily look them up
        grouped_programs = {
            'education': [],
            'health': [],
            'agribusiness': [],
            'environment': [],
            'disaster-response': []
        }

        for prog in programs:
            grouped_programs[prog.pillar].append(SubProgramSerializer(prog).data)

        return Response(grouped_programs)
    
class ImpactDataView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        # Optional: Add a query parameter to filter by year (e.g., ?year=2024)
        target_year = request.query_params.get('year', 2024) 

        big_stats = BigStat.objects.all()
        stories = SuccessStory.objects.all()
        reports = Report.objects.all()
        
        # Group stats by Pillar
        # To this:
        pillar_stats_qs = PillarStat.objects.all()
        grouped_pillars = {
            'Education': [],
            'Health': [],
            'Environment': [],
            'Agribusiness': [],
            'Disaster Response': []
        }
        
        for stat in pillar_stats_qs:
            grouped_pillars[stat.pillar].append({
                'number': stat.number,
                'unit': stat.unit
            })

        return Response({
            'big_stats': BigStatSerializer(big_stats, many=True).data,
            'pillar_stats': grouped_pillars,
            'stories': SuccessStorySerializer(stories, many=True, context={'request': request}).data,
            'reports': ReportSerializer(reports, many=True, context={'request': request}).data,
        })

class LeadershipViewSet(viewsets.ModelViewSet):
    queryset = Leadership.objects.all()
    serializer_class = LeadershipSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # ✅ handles file uploads

    def get_serializer_context(self):
        return {'request': self.request}  # ✅ needed for absolute image URLs



# ARTICLES

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all().order_by('-created_at')
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]


# CONTACT MESSAGES
class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all().order_by('-submitted_at')
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAdminUser]

# UPCOMING EVENTS
class UpcomingEventsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        upcoming_events = Event.objects.filter(event_date__gte=date.today()).order_by('event_date')
        serializer = EventSerializer(upcoming_events, many=True, context={'request': request})
        return Response(serializer.data)

# PAST EVENTS
class PastEventsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        past_events = Event.objects.filter(event_date__lt=date.today()).order_by('-event_date')
        serializer = EventSerializer(past_events, many=True, context={'request': request})
        return Response(serializer.data)

# CREATE / UPDATE / DELETE EVENT WITH IMAGES
class CreateEventWithImages(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            event = serializer.save()
            images = request.FILES.getlist('images')
            for img in images:
                EventImage.objects.create(event=event, image=img)
            return Response(EventSerializer(event).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            event = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return Response({'detail': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = EventSerializer(event, data=request.data)
        if serializer.is_valid():
            event = serializer.save()

            # Remove old images (optional depending on your UX design)
            event.images.all().delete()

            # Add new images if any
            images = request.FILES.getlist('images')
            for img in images:
                EventImage.objects.create(event=event, image=img)

            return Response(EventSerializer(event).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            event = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return Response({'detail': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        # Delete related images explicitly if not handled automatically
        event.images.all().delete()
        event.delete()
        return Response({'detail': 'Event deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


from .models import Volunteer, Partner, Donate
from .serializers import VolunteerSerializer, PartnerSerializer, DonateSerializer

class VolunteerSubmissionView(generics.CreateAPIView):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer
    permission_classes = [AllowAny]

class PartnerSubmissionView(generics.CreateAPIView):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer
    permission_classes = [AllowAny]

class DonateSubmissionView(generics.CreateAPIView):
    queryset = Donate.objects.all()
    serializer_class = DonateSerializer
    permission_classes = [AllowAny]


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all().order_by('-created_at')
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.AllowAny]  # Anyone can GET and POST
    
    
# from django.http import HttpResponse
# from django.core.management import call_command

# def run_migrations(request):
#     call_command('migrate')
#     return HttpResponse("Migrations applied successfully")
