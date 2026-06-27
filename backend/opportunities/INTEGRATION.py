# ═══════════════════════════════════════════════════════════════════
#  INTEGRATION REFERENCE  —  opportunities module
#  Copy the relevant blocks into your existing project settings / urls
# ═══════════════════════════════════════════════════════════════════


# ───────────────────────────────────────────
# 1.  INSTALLED_APPS  (settings.py)
# ───────────────────────────────────────────
INSTALLED_APPS = [
    # … your existing apps …
    "rest_framework",
    "django_filters",       # pip install django-filter
    "opportunities",        # ← add this
]


# ───────────────────────────────────────────
# 2.  DJANGO REST FRAMEWORK  (settings.py)
# ───────────────────────────────────────────
REST_FRAMEWORK = {
    # Enable django-filter globally
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    # Pagination (optional but recommended for production)
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    # Authentication (keep whatever you currently use)
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    ],
}


# ───────────────────────────────────────────
# 3.  MEDIA FILES  (settings.py)
# ───────────────────────────────────────────
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent   # adjust if already defined

MEDIA_URL  = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

# File upload size limits (adjust to your hosting plan)
DATA_UPLOAD_MAX_MEMORY_SIZE = 20 * 1024 * 1024   # 20 MB form fields
FILE_UPLOAD_MAX_MEMORY_SIZE = 20 * 1024 * 1024   # 20 MB before temp-file switch


# ───────────────────────────────────────────
# 4.  ROOT URL CONFIGURATION  (imarikapp/urls.py or project urls.py)
# ───────────────────────────────────────────
#
# Add these lines to your existing urlpatterns:
#
#   from django.conf import settings
#   from django.conf.urls.static import static
#   from django.urls import path, include
#
#   urlpatterns = [
#       ...
#       path("", include("opportunities.urls")),   # ← add this
#       ...
#   ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#


# ───────────────────────────────────────────
# 5.  CORS (if your React frontend is on a different origin)
# ───────────────────────────────────────────
#
#   pip install django-cors-headers
#
#   INSTALLED_APPS += ["corsheaders"]
#
#   MIDDLEWARE = [
#       "corsheaders.middleware.CorsMiddleware",   # ← must be first
#       "django.middleware.common.CommonMiddleware",
#       ...
#   ]
#
#   CORS_ALLOWED_ORIGINS = [
#       "http://localhost:3000",        # Vite / CRA dev server
#       "https://imarikafoundation.org",
#   ]


# ───────────────────────────────────────────
# 6.  COMMANDS to run after adding the app
# ───────────────────────────────────────────
#
#   pip install django-filter Pillow
#   python manage.py migrate
#   python manage.py createsuperuser   # if not done already
