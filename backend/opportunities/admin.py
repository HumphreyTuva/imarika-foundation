"""
opportunities/admin.py
-----------------------
Django Admin configuration for the Opportunities module.

Features:
  - Inline attachment management directly from the Opportunity change page.
  - List display with title, type, status, deadline, publish date, featured flag.
  - List filters for quick narrowing by type, status, featured flag, and deadline year.
  - Search across title, reference number, summary, and description.
  - Slug is auto-populated from the title (editable if needed).
  - Custom action to bulk-mark opportunities as OPEN or CLOSED.
  - Colour-coded status badge in the list view (via HTML).
"""

from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone

from .models import Opportunity, OpportunityAttachment, OpportunityStatus


# ─────────────────────────────────────────────
#  Attachment inline
# ─────────────────────────────────────────────

class OpportunityAttachmentInline(admin.TabularInline):
    """
    Inline table on the Opportunity change page.
    Allows adding, editing, and deleting attachments without leaving the form.
    """
    model       = OpportunityAttachment
    extra       = 1           # show 1 blank row by default
    fields      = ["title", "file", "uploaded_at"]
    readonly_fields = ["uploaded_at"]
    show_change_link = False  # keep the UI clean; edit inline is enough


# ─────────────────────────────────────────────
#  Status badge helper (HTML)
# ─────────────────────────────────────────────

STATUS_BADGE_STYLES = {
    OpportunityStatus.DRAFT:    ("background:#e2e8f0; color:#64748b",  "Draft"),
    OpportunityStatus.OPEN:     ("background:#dcfce7; color:#166534",  "Open"),
    OpportunityStatus.CLOSED:   ("background:#fee2e2; color:#991b1b",  "Closed"),
    OpportunityStatus.AWARDED:  ("background:#dbeafe; color:#1e40af",  "Awarded"),
    OpportunityStatus.FILLED:   ("background:#ede9fe; color:#5b21b6",  "Filled"),
    OpportunityStatus.ARCHIVED: ("background:#f1f5f9; color:#94a3b8",  "Archived"),
}


def _status_badge(status_value):
    style, label = STATUS_BADGE_STYLES.get(
        status_value,
        ("background:#f1f5f9; color:#64748b", status_value)
    )
    return format_html(
        '<span style="{}; padding:2px 10px; border-radius:12px; '
        'font-size:11px; font-weight:700; letter-spacing:.05em;">{}</span>',
        style,
        label,
    )


# ─────────────────────────────────────────────
#  Opportunity admin
# ─────────────────────────────────────────────

@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    """
    Full admin view for managing all opportunity types.
    """

    # ── List view ──
    list_display = [
        "title",
        "opportunity_type",
        "status_badge",
        "location",
        "deadline",
        "publish_date",
        "is_featured",
        "reference_number",
    ]
    list_display_links = ["title"]
    list_editable      = ["is_featured"]
    list_filter        = [
        "opportunity_type",
        "status",
        "is_featured",
        ("deadline", admin.DateFieldListFilter),
        ("publish_date", admin.DateFieldListFilter),
    ]
    search_fields = ["title", "reference_number", "summary", "description"]
    date_hierarchy = "deadline"

    # ── Form view ──
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields     = ["created_at", "updated_at", "reference_number"]

    fieldsets = [
        (
            "Identity",
            {
                "fields": ["title", "slug", "reference_number", "opportunity_type"],
            },
        ),
        (
            "Status & Visibility",
            {
                "fields": ["status", "is_featured"],
            },
        ),
        (
            "Content",
            {
                "fields": ["summary", "description"],
                "classes": ["wide"],
            },
        ),
        (
            "Context",
            {
                "fields": ["location"],
            },
        ),
        (
            "Dates",
            {
                "fields": ["publish_date", "deadline", "closing_date"],
            },
        ),
        (
            "Media",
            {
                "fields": ["featured_image"],
            },
        ),
        (
            "Metadata",
            {
                "fields": ["created_at", "updated_at"],
                "classes": ["collapse"],
            },
        ),
    ]

    inlines = [OpportunityAttachmentInline]

    # ── Custom display column: coloured status badge ──
    @admin.display(description="Status", ordering="status")
    def status_badge(self, obj):
        return _status_badge(obj.status)

    # ── Bulk actions ──
    actions = ["mark_open", "mark_closed", "mark_archived"]

    @admin.action(description="Mark selected opportunities as Open")
    def mark_open(self, request, queryset):
        updated = queryset.update(status=OpportunityStatus.OPEN)
        self.message_user(request, f"{updated} opportunity/ies marked as Open.")

    @admin.action(description="Mark selected opportunities as Closed")
    def mark_closed(self, request, queryset):
        updated = queryset.update(status=OpportunityStatus.CLOSED)
        self.message_user(request, f"{updated} opportunity/ies marked as Closed.")

    @admin.action(description="Archive selected opportunities")
    def mark_archived(self, request, queryset):
        updated = queryset.update(status=OpportunityStatus.ARCHIVED)
        self.message_user(request, f"{updated} opportunity/ies archived.")


# ─────────────────────────────────────────────
#  Attachment admin (standalone, for bulk review)
# ─────────────────────────────────────────────

@admin.register(OpportunityAttachment)
class OpportunityAttachmentAdmin(admin.ModelAdmin):
    """
    Standalone admin for attachments — useful for bulk review or deletion.
    Attachments can also be managed inline from the Opportunity page above.
    """
    list_display  = ["title", "opportunity", "uploaded_at"]
    list_filter   = ["uploaded_at"]
    search_fields = ["title", "opportunity__title", "opportunity__reference_number"]
    readonly_fields = ["uploaded_at"]
    raw_id_fields   = ["opportunity"]   # avoids loading a huge dropdown
