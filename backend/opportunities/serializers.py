"""
opportunities/serializers.py
-----------------------------
DRF serializers for the Opportunities module.

Serializer hierarchy:
  OpportunityAttachmentSerializer  — flat attachment (used as inline)
  OpportunityListSerializer        — lightweight, for listing endpoints
  OpportunityDetailSerializer      — full detail with nested attachments
  OpportunityWriteSerializer       — used for create / update (handles file uploads)

All serializers build absolute media URLs via the request context so
the React frontend receives full URLs rather than bare paths.
"""

import os
from django.utils import timezone
from rest_framework import serializers

from .models import (
    Opportunity,
    OpportunityAttachment,
    ALLOWED_ATTACHMENT_EXTENSIONS,
    ALLOWED_ATTACHMENT_MIME_TYPES,
)


# ─────────────────────────────────────────────
#  Attachment serializer
# ─────────────────────────────────────────────

class OpportunityAttachmentSerializer(serializers.ModelSerializer):
    """
    Serializes a single attachment.
    Returns an absolute URL for the file field.
    """

    file_url = serializers.SerializerMethodField()

    class Meta:
        model  = OpportunityAttachment
        fields = ["id", "title", "file", "file_url", "uploaded_at"]
        # 'file' is write-only (upload path); 'file_url' is the read-friendly version
        extra_kwargs = {"file": {"write_only": True}}

    def get_file_url(self, obj):
        request = self.context.get("request")
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

    # ── File validation ──
    def validate_file(self, value):
        ext  = os.path.splitext(value.name)[1].lower()
        mime = getattr(value, "content_type", "")

        if ext not in ALLOWED_ATTACHMENT_EXTENSIONS:
            raise serializers.ValidationError(
                f"File type '{ext}' is not allowed. "
                f"Accepted: {', '.join(sorted(ALLOWED_ATTACHMENT_EXTENSIONS))}"
            )
        if mime and mime not in ALLOWED_ATTACHMENT_MIME_TYPES:
            raise serializers.ValidationError(
                f"MIME type '{mime}' is not permitted for attachments."
            )
        return value


# ─────────────────────────────────────────────
#  List serializer (lightweight)
# ─────────────────────────────────────────────

class OpportunityListSerializer(serializers.ModelSerializer):
    """
    Compact representation used on the listing / cards page.
    Excludes long 'description' to keep payloads small.
    """

    opportunity_type_display = serializers.CharField(
        source="get_opportunity_type_display",
        read_only=True,
    )
    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True,
    )
    is_open    = serializers.BooleanField(read_only=True)
    is_expired = serializers.BooleanField(read_only=True)

    featured_image_url = serializers.SerializerMethodField()

    # Attachment count — avoids a full attachment serialization on the list
    attachment_count = serializers.IntegerField(
        source="attachments.count",
        read_only=True,
    )

    class Meta:
        model = Opportunity
        fields = [
            "id",
            "title",
            "slug",
            "reference_number",
            "opportunity_type",
            "opportunity_type_display",
            "status",
            "status_display",
            "summary",
            "location",
            "deadline",
            "publish_date",
            "is_featured",
            "is_open",
            "is_expired",
            "featured_image_url",
            "attachment_count",
            "created_at",
            "updated_at",
        ]

    def get_featured_image_url(self, obj):
        request = self.context.get("request")
        if obj.featured_image and request:
            return request.build_absolute_uri(obj.featured_image.url)
        return None


# ─────────────────────────────────────────────
#  Detail serializer (full)
# ─────────────────────────────────────────────

class OpportunityDetailSerializer(OpportunityListSerializer):
    """
    Full representation including description and nested attachments.
    Extends OpportunityListSerializer so shared fields aren't repeated.
    """

    attachments = OpportunityAttachmentSerializer(many=True, read_only=True)

    class Meta(OpportunityListSerializer.Meta):
        fields = OpportunityListSerializer.Meta.fields + [
            "description",
            "closing_date",
            "attachments",
        ]


# ─────────────────────────────────────────────
#  Write serializer (create / update)
# ─────────────────────────────────────────────

class OpportunityWriteSerializer(serializers.ModelSerializer):
    """
    Used for POST / PUT / PATCH.

    Accepts:
      - All Opportunity fields
      - Optional 'attachments' list (each item: {title, file})

    The slug and reference_number are auto-generated on the model if omitted.
    """

    # Allow partial attachment creation in the same request
    attachments = OpportunityAttachmentSerializer(
        many=True,
        required=False,
        write_only=True,
    )

    class Meta:
        model = Opportunity
        fields = [
            "id",
            "title",
            "slug",
            "reference_number",
            "opportunity_type",
            "status",
            "summary",
            "description",
            "location",
            "deadline",
            "publish_date",
            "closing_date",
            "featured_image",
            "is_featured",
            "attachments",
        ]
        extra_kwargs = {
            # Both auto-generated; not required from the client
            "slug":             {"required": False},
            "reference_number": {"required": False},
        }

    # ── Field-level validation ──

    def validate_deadline(self, value):
        """
        Warn (but don't block) if deadline is in the past on create.
        On update, allow any date.
        """
        if value and value < timezone.now().date() and not self.instance:
            raise serializers.ValidationError(
                "Deadline cannot be in the past when creating a new opportunity."
            )
        return value

    def validate_featured_image(self, value):
        """Restrict featured image to common web-safe image types."""
        if value:
            allowed_img_ext = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in allowed_img_ext:
                raise serializers.ValidationError(
                    f"Image type '{ext}' is not allowed. "
                    f"Accepted: {', '.join(sorted(allowed_img_ext))}"
                )
        return value

    # ── Create ──

    def create(self, validated_data):
        attachments_data = validated_data.pop("attachments", [])
        opportunity = Opportunity.objects.create(**validated_data)
        for att in attachments_data:
            OpportunityAttachment.objects.create(opportunity=opportunity, **att)
        return opportunity

    # ── Update ──

    def update(self, instance, validated_data):
        # Attachments in a PUT/PATCH add to existing ones; they are not replaced.
        # Use the dedicated attachment endpoints (DELETE /attachments/<id>/) to remove.
        attachments_data = validated_data.pop("attachments", [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        for att in attachments_data:
            OpportunityAttachment.objects.create(opportunity=instance, **att)

        return instance
