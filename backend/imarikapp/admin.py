from django.contrib import admin
from .models import SubProgram, BigStat, PillarStat, SuccessStory, Report, Article, Event, ContactMessage, EventImage, Volunteer, Partner, Donate, Testimonial, Leadership
from datetime import date
# impact/admin.py
from django.contrib import admin
from .models import SubProgram, ProgramActivity, ProgramImpact

class ProgramActivityInline(admin.TabularInline):
    model = ProgramActivity
    extra = 1 # Shows 1 empty row by default

class ProgramImpactInline(admin.TabularInline):
    model = ProgramImpact
    extra = 1

@admin.register(SubProgram)
class SubProgramAdmin(admin.ModelAdmin):
    list_display = ('title', 'pillar', 'slug', 'order')
    list_filter = ('pillar',)
    list_editable = ('order',)
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ProgramImpactInline, ProgramActivityInline] 

@admin.register(BigStat)
class BigStatAdmin(admin.ModelAdmin):
    # Columns shown in the list view
    list_display = ('label', 'number', 'suffix', 'order')
    # Allows you to edit the order directly from the list view
    list_editable = ('order',)
    # Adds a search bar for these fields
    search_fields = ('label', 'sub_label')
    ordering = ('order',)

@admin.register(PillarStat)
class PillarStatAdmin(admin.ModelAdmin):
    list_display = ('pillar', 'number', 'unit', 'year', 'order')
    # Adds a filter sidebar to sort by Pillar or Year
    list_filter = ('pillar', 'year')
    list_editable = ('order',)
    search_fields = ('unit',)
    ordering = ('order', '-year')

@admin.register(SuccessStory)
class SuccessStoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'order')
    list_filter = ('category',)
    search_fields = ('title', 'body')
    ordering = ('order', '-id')

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'meta_text', 'order')
    search_fields = ('title', 'meta_text')
    ordering = ('order', '-id')


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    search_fields = ('title',)


class EventImageInline(admin.TabularInline):
    model = EventImage
    extra = 1


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'event_date', 'start_time', 'end_time', 'location', 'status_display')
    search_fields = ('title', 'location')
    list_filter = ('event_date',)
    inlines = [EventImageInline]

    def status_display(self, obj):
        return "Past" if obj.event_date < date.today() else "Upcoming"
    status_display.short_description = 'Status'


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'submitted_at')
    search_fields = ('name', 'email', 'subject')
    readonly_fields = ('submitted_at',)


@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'submitted_at']
    search_fields = ['full_name', 'email']


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'submitted_at']
    search_fields = ['full_name', 'email']


@admin.register(Donate)
class DonateAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'mpesa_code', 'submitted_at']
    search_fields = ['full_name', 'email', 'mpesa_code']


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'created_at')
    search_fields = ('name', 'role', 'text')
    list_filter = ('created_at',)


@admin.register(Leadership)
class LeadershipAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'category', 'order')
    list_filter = ('category',)
    search_fields = ('name', 'role')