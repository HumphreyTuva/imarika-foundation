"""
opportunities/filters.py
------------------------
django-filter FilterSet for the Opportunity model.

Supports filtering by:
  - opportunity_type   (exact)
  - status             (exact)
  - location           (case-insensitive contains)
  - deadline           (exact, before, after)
  - is_featured        (boolean)

Usage in views:
    filterset_class = OpportunityFilter

Install requirement:
    pip install django-filter
    # Add 'django_filters' to INSTALLED_APPS
    # Add DEFAULT_FILTER_BACKENDS in DRF settings (see settings snippet below)
"""

import django_filters
from .models import Opportunity, OpportunityType, OpportunityStatus


class OpportunityFilter(django_filters.FilterSet):
    """
    Flexible filter set wired to the Opportunity model.

    Query-string examples (all combinable):
        ?opportunity_type=tender
        ?status=open
        ?location=Kilifi
        ?deadline=2026-06-30
        ?deadline_before=2026-12-31
        ?deadline_after=2026-01-01
        ?is_featured=true
    """

    # ── Type & status ──
    opportunity_type = django_filters.ChoiceFilter(
        choices=OpportunityType.choices,
        label="Opportunity Type",
    )
    status = django_filters.ChoiceFilter(
        choices=OpportunityStatus.choices,
        label="Status",
    )

    # ── Location (case-insensitive substring match) ──
    location = django_filters.CharFilter(
        field_name="location",
        lookup_expr="icontains",
        label="Location (contains)",
    )

    # ── Deadline filters ──
    deadline = django_filters.DateFilter(
        field_name="deadline",
        label="Deadline (exact date)",
    )
    deadline_before = django_filters.DateFilter(
        field_name="deadline",
        lookup_expr="lte",
        label="Deadline on or before",
    )
    deadline_after = django_filters.DateFilter(
        field_name="deadline",
        lookup_expr="gte",
        label="Deadline on or after",
    )

    # ── Featured flag ──
    is_featured = django_filters.BooleanFilter(
        field_name="is_featured",
        label="Featured only",
    )

    class Meta:
        model  = Opportunity
        fields = [
            "opportunity_type",
            "status",
            "location",
            "deadline",
            "deadline_before",
            "deadline_after",
            "is_featured",
        ]
