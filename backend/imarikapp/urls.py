from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VolunteerSubmissionView,
    PartnerSubmissionView,
    DonateSubmissionView,
    ArticleViewSet,
    UpcomingEventsAPIView,
    PastEventsAPIView,
    ContactMessageViewSet,
    CreateEventWithImages,
    TestimonialViewSet,
    LeadershipViewSet,
    ImpactDataView, 
    ProgramsDataView,
    SubProgramViewSet,
    BigStatViewSet,
    PillarStatViewSet,
    SuccessStoryViewSet,
    ReportViewSet,
)

router = DefaultRouter()
router.register(r'articles', ArticleViewSet)
router.register(r'contact', ContactMessageViewSet)
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'leadership', LeadershipViewSet, basename='leadership')
router.register(r'admin/programs', SubProgramViewSet, basename='admin-programs')

router.register(r'admin/bigstats', BigStatViewSet, basename='admin-bigstats')
router.register(r'admin/pillarstats', PillarStatViewSet, basename='admin-pillarstats')
router.register(r'admin/stories', SuccessStoryViewSet, basename='admin-stories')
router.register(r'admin/reports', ReportViewSet, basename='admin-reports')
# from .views import run_migrations

urlpatterns = [
    path('api/', include(router.urls)), 
    # path('run-migrations/', run_migrations),

    path('events/upcoming/', UpcomingEventsAPIView.as_view(), name='upcoming-events'),
    path('events/past/', PastEventsAPIView.as_view(), name='past-events'),
    path('events/create-with-images/', CreateEventWithImages.as_view(), name='create-event-with-images'),
    path('events/<int:pk>/', CreateEventWithImages.as_view(), name='update-event-with-images'),
    path('submit/volunteer/', VolunteerSubmissionView.as_view(), name='submit-volunteer'),
    path('submit/partner/', PartnerSubmissionView.as_view(), name='submit-partner'),
    path('submit/donate/', DonateSubmissionView.as_view(), name='submit-donate'),
    path('api/impact-data/', ImpactDataView.as_view(), name='impact-data'),
    path('api/programs-data/', ProgramsDataView.as_view(), name='programs-data'),

]