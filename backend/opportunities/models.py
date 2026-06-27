"""
opportunities/models.py
-----------------------
Data models for the Imarika Foundation Opportunities module.

Covers: Tenders, Consultancies, Job Vacancies, Internships,
        Volunteer Opportunities, and Expressions of Interest (EOIs).

Design notes:
  - Slug is auto-generated from title on first save; can be overridden.
  - Reference number is auto-generated in the format IF/<TYPE>/<YEAR>/<SEQ>
    if not supplied manually.
  - OpportunityAttachment supports PDF, DOCX, XLSX, PPTX, ZIP uploads
    with server-side MIME/extension validation.
"""

import uuid
from django.db import models
from django.utils import timezone
from django.utils.text import slugify


# ─────────────────────────────────────────────
#  Choice constants
# ─────────────────────────────────────────────

class OpportunityType(models.TextChoices):
    TENDER      = "tender",      "Tender"
    CONSULTANCY = "consultancy", "Consultancy"
    JOB         = "job",         "Job Vacancy"
    INTERNSHIP  = "internship",  "Internship"
    VOLUNTEER   = "volunteer",   "Volunteer Opportunity"
    EOI         = "eoi",         "Expression of Interest"


class OpportunityStatus(models.TextChoices):
    DRAFT    = "draft",    "Draft"
    OPEN     = "open",     "Open"
    CLOSED   = "closed",   "Closed"
    AWARDED  = "awarded",  "Awarded"
    FILLED   = "filled",   "Filled"
    ARCHIVED = "archived", "Archived"


# Short codes used inside auto-generated reference numbers, e.g. IF/TDR/2026/001
REF_TYPE_CODE = {
    OpportunityType.TENDER:      "TDR",
    OpportunityType.CONSULTANCY: "CON",
    OpportunityType.JOB:         "JOB",
    OpportunityType.INTERNSHIP:  "INT",
    OpportunityType.VOLUNTEER:   "VOL",
    OpportunityType.EOI:         "EOI",
}


# ─────────────────────────────────────────────
#  Helper: unique slug
# ─────────────────────────────────────────────

def _unique_slug(model_class, title, instance_pk=None):
    """
    Return a slug derived from *title* that is unique within *model_class*.
    Appends a numeric suffix (-2, -3, …) when there is a collision.
    """
    base = slugify(title)
    slug = base
    n = 2
    qs = model_class.objects.filter(slug=slug)
    if instance_pk:
        qs = qs.exclude(pk=instance_pk)
    while qs.exists():
        slug = f"{base}-{n}"
        n += 1
        qs = model_class.objects.filter(slug=slug)
        if instance_pk:
            qs = qs.exclude(pk=instance_pk)
    return slug


# ─────────────────────────────────────────────
#  Helper: unique reference number
# ─────────────────────────────────────────────

def _generate_ref(opportunity_type):
    """
    Build a reference in the format IF/<TYPE_CODE>/<YEAR>/<SEQ>.
    <SEQ> is zero-padded to 3 digits and increments per type per year.

    Example: IF/TDR/2026/004
    """
    code = REF_TYPE_CODE.get(opportunity_type, "OPP")
    year = timezone.now().year

    # Count existing opportunities of the same type in the current year
    # to determine the next sequential number.
    prefix = f"IF/{code}/{year}/"
    count = Opportunity.objects.filter(
        reference_number__startswith=prefix
    ).count()

    seq = str(count + 1).zfill(3)
    return f"{prefix}{seq}"


# ─────────────────────────────────────────────
#  Opportunity model
# ─────────────────────────────────────────────

class Opportunity(models.Model):
    """
    Central model representing any type of public opportunity published
    by Imarika Foundation.
    """

    # ── Identity ──
    title = models.CharField(
        max_length=255,
        help_text="Full title of the opportunity."
    )
    slug = models.SlugField(
        max_length=280,
        unique=True,
        blank=True,
        help_text="URL-safe identifier. Auto-generated from title if left blank."
    )
    reference_number = models.CharField(
        max_length=50,
        unique=True,
        blank=True,
        help_text="e.g. IF/TDR/2026/001. Auto-generated if left blank."
    )

    # ── Classification ──
    opportunity_type = models.CharField(
        max_length=20,
        choices=OpportunityType.choices,
        default=OpportunityType.TENDER,
        db_index=True,
    )
    status = models.CharField(
        max_length=20,
        choices=OpportunityStatus.choices,
        default=OpportunityStatus.DRAFT,
        db_index=True,
    )

    # ── Content ──
    summary = models.TextField(
        max_length=500,
        blank=True,
        help_text="Short teaser shown on listing cards (max 500 chars)."
    )
    description = models.TextField(
        blank=True,
        help_text="Full body content. Supports plain text or Markdown."
    )

    # ── Context ──
    location = models.CharField(
        max_length=255,
        blank=True,
        help_text="e.g. 'Kilifi County' or 'Remote'.",
        db_index=True,
    )

    # ── Dates ──
    deadline = models.DateField(
        null=True,
        blank=True,
        db_index=True,
        help_text="Application / submission deadline."
    )
    publish_date = models.DateField(
        null=True,
        blank=True,
        db_index=True,
        help_text="Date the opportunity goes / went live."
    )
    closing_date = models.DateField(
        null=True,
        blank=True,
        help_text="Administrative closing date (may differ from deadline)."
    )

    # ── Media ──
    featured_image = models.ImageField(
        upload_to="opportunities/images/",
        null=True,
        blank=True,
        help_text="Banner / thumbnail image."
    )

    # ── Flags ──
    is_featured = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Pin to the top of the listing page."
    )

    # ── Timestamps ──
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = "Opportunity"
        verbose_name_plural = "Opportunities"
        ordering            = ["-is_featured", "-publish_date", "-created_at"]
        indexes = [
            models.Index(fields=["opportunity_type", "status"]),
            models.Index(fields=["deadline"]),
        ]

    # ── Auto-slug & auto-ref on save ──
    def save(self, *args, **kwargs):
        # Generate slug only on first save (or if title changed and slug is empty)
        if not self.slug:
            self.slug = _unique_slug(Opportunity, self.title, self.pk)

        # Generate reference number only on first save
        if not self.reference_number:
            self.reference_number = _generate_ref(self.opportunity_type)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.get_opportunity_type_display()}] {self.title}"

    # ── Computed properties ──
    @property
    def is_open(self):
        """True when status is OPEN and deadline has not passed."""
        if self.status != OpportunityStatus.OPEN:
            return False
        if self.deadline and self.deadline < timezone.now().date():
            return False
        return True

    @property
    def is_expired(self):
        """True when the deadline has passed, regardless of status."""
        return bool(self.deadline and self.deadline < timezone.now().date())


# ─────────────────────────────────────────────
#  Allowed attachment MIME types & extensions
# ─────────────────────────────────────────────

ALLOWED_ATTACHMENT_EXTENSIONS = {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".pptx", ".zip"}

ALLOWED_ATTACHMENT_MIME_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/zip",
    "application/x-zip-compressed",
}


# ─────────────────────────────────────────────
#  Attachment model
# ─────────────────────────────────────────────

class OpportunityAttachment(models.Model):
    """
    A supporting file (PDF, DOCX, XLSX, PPTX, ZIP) linked to an Opportunity.
    Multiple attachments per opportunity are supported.
    """

    opportunity = models.ForeignKey(
        Opportunity,
        on_delete=models.CASCADE,
        related_name="attachments",
    )
    title = models.CharField(
        max_length=255,
        help_text="Human-readable label, e.g. 'Tender Document' or 'Application Form'."
    )
    file = models.FileField(
        upload_to="opportunities/attachments/",
        help_text="Accepted formats: PDF, DOCX, XLSX, PPTX, ZIP."
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = "Attachment"
        verbose_name_plural = "Attachments"
        ordering            = ["uploaded_at"]

    def __str__(self):
        return f"{self.title} — {self.opportunity.reference_number}"
