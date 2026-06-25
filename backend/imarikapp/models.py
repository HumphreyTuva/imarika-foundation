from django.db import models
from datetime import date, datetime

class Article(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)  # Make content optional
    file = models.FileField(upload_to='articles/', blank=True, null=True)  # Add this line
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(max_length=500)
    event_date = models.DateField()
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    location = models.CharField(max_length=255)

    @property
    def status(self):
        return "Past" if self.event_date < date.today() else "Upcoming"

    def __str__(self):
        return self.title


class EventImage(models.Model):
    event = models.ForeignKey(Event, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='event_images/')

    def __str__(self):
        return f"Image for {self.event.title}"

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"
    


class Volunteer(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Volunteer - {self.full_name}"

class Partner(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Partner - {self.full_name}"

class Donate(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    mpesa_code = models.CharField(max_length=100)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Donate - {self.full_name}"

class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100, blank=True)  # e.g., Beneficiary, Volunteer, Student
    text = models.TextField()
    image = models.ImageField(upload_to="testimonials/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.role}"


#Leadership

class Leadership(models.Model):
    CATEGORY_CHOICES = [
        ('board', 'Board Member'),
        ('staff', 'Staff'),
    ]

    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    image = models.ImageField(upload_to='leadership/')
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    bio = models.TextField(blank=True, null=True)
    order = models.IntegerField(default=0)  # for sorting

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.name} - {self.role}"

# impact/models.py

class BigStat(models.Model):
    number = models.IntegerField(help_text="e.g., 5000")
    suffix = models.CharField(max_length=10, blank=True, help_text="e.g., +, %")
    label = models.CharField(max_length=100)
    sub_label = models.CharField(max_length=150, blank=True)
    color = models.CharField(max_length=20, default="#ee4c05", help_text="Hex color code")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.label

class Pillar(models.Model):
    title = models.CharField(max_length=100)
    icon_name = models.CharField(max_length=50, help_text="React icon component name, e.g., FaGraduationCap")
    color = models.CharField(max_length=20, default="#ee4c05")
    bg_color = models.CharField(max_length=30, default="rgba(238,76,5,.1)")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class PillarStat(models.Model):
    PILLAR_CHOICES = [
        ('Education', 'Education'),
        ('Health', 'Health'),
        ('Environment', 'Environment'),
        ('Agribusiness', 'Agribusiness'),
        ('Disaster Response', 'Disaster Response'),
    ]

    pillar = models.CharField(max_length=50, choices=PILLAR_CHOICES)
    number = models.CharField(max_length=50, help_text="e.g., 160 or 10,000+")
    unit = models.CharField(max_length=100, help_text="e.g., Scholars sponsored")
    year = models.IntegerField(default=datetime.now().year, help_text="Filter stats by year")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.pillar} - {self.number} {self.unit} ({self.year})"

# (Keep BigStat, SuccessStory, and Report models as they were)

class SuccessStory(models.Model):
    category = models.CharField(max_length=50)
    title = models.CharField(max_length=200)
    body = models.TextField()
    image = models.ImageField(upload_to='stories/', null=True, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', '-id']

    def __str__(self):
        return self.title

class Report(models.Model):
    title = models.CharField(max_length=200)
    meta_text = models.CharField(max_length=200, help_text="e.g., PDF · Published March 2025 · 32 pages")
    file = models.FileField(upload_to='reports/', null=True, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', '-id']

    def __str__(self):
        return self.title


class SubProgram(models.Model):
    PILLAR_CHOICES = [
        ('education', 'Education'),
        ('health', 'Health'),
        ('agribusiness', 'Agribusiness'),
        ('environment', 'Environment'),
        ('disaster-response', 'Disaster Response'),
    ]

    pillar = models.CharField(max_length=50, choices=PILLAR_CHOICES)
    slug = models.SlugField(max_length=100)
    title = models.CharField(max_length=200)
    desc = models.TextField(help_text="Short description for the card")
    icon = models.CharField(max_length=20, help_text="Emoji icon, e.g., 🎓")
    
    # NEW DETAILED FIELDS
    overview = models.TextField(blank=True, null=True, help_text="Full programme overview")
    objectives_list = models.TextField(blank=True, null=True, help_text="Enter ONE objective per line. Press Enter to separate.")
    partners_list = models.TextField(blank=True, null=True, help_text="Enter ONE partner per line. Press Enter to separate.")
    story_quote = models.TextField(blank=True, null=True, help_text="The success story quote")
    story_attr = models.CharField(max_length=200, blank=True, null=True, help_text="e.g., — Baraka Peter, Beneficiary")
    
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.get_pillar_display()} - {self.title}"

# NEW MODEL: For the Activity Cards
class ProgramActivity(models.Model):
    subprogram = models.ForeignKey(SubProgram, related_name='activities', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    desc = models.TextField()
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

# NEW MODEL: For the Impact Strip
class ProgramImpact(models.Model):
    subprogram = models.ForeignKey(SubProgram, related_name='impacts', on_delete=models.CASCADE)
    number = models.CharField(max_length=50, help_text="e.g., 160 or 97%")
    label = models.CharField(max_length=100, help_text="e.g., Students Sponsored")
    sub_label = models.CharField(max_length=100, blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']