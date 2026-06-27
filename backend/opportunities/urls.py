"""
opportunities/urls.py
----------------------
URL configuration for the Opportunities module.

All routes are prefixed with /api/ when included in the project's
root urls.py (see integration note at the bottom of this file).

Generated routes
----------------
GET     /api/opportunities/                              — list all visible opportunities
POST    /api/opportunities/                              — create (staff only)
GET     /api/opportunities/<pk>/                         — retrieve detail
PUT     /api/opportunities/<pk>/                         — full update (staff only)
PATCH   /api/opportunities/<pk>/                         — partial update (staff only)
DELETE  /api/opportunities/<pk>/                         — delete (staff only)
POST    /api/opportunities/<pk>/attachments/             — add attachment (staff only)
DELETE  /api/opportunities/<pk>/attachments/<att_pk>/    — remove attachment (staff only)

─────────────────────────────────────────────────────────
Integration: imarikapp/urls.py  (root URL file)
─────────────────────────────────────────────────────────
Add this to the existing urlpatterns list:

    from django.urls import path, include

    urlpatterns = [
        ...
        path("", include("opportunities.urls")),
        ...
    ]
─────────────────────────────────────────────────────────
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import OpportunityViewSet

# DRF DefaultRouter automatically generates the standard CRUD routes.
router = DefaultRouter()
router.register(r"opportunities", OpportunityViewSet, basename="opportunity")

urlpatterns = [
    path("api/", include(router.urls)),
]
