from rest_framework import serializers
from .models import ProgramActivity, ProgramImpact,SubProgram, Article, Event, ContactMessage, EventImage, Volunteer, Partner, Donate, Testimonial, Leadership, BigStat, Pillar, PillarStat, SuccessStory, Report

class ProgramActivitySerializer(serializers.ModelSerializer):
    # Add id so Django doesn't get confused during updates
    id = serializers.IntegerField(required=False) 
    class Meta:
        model = ProgramActivity
        fields = ['id', 'title', 'desc', 'order']

class ProgramImpactSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = ProgramImpact
        fields = ['id', 'number', 'label', 'sub_label', 'order']

class SubProgramSerializer(serializers.ModelSerializer):
    # Remove read_only=True so the API accepts data from React
    activities = ProgramActivitySerializer(many=True, required=False)
    impacts = ProgramImpactSerializer(many=True, required=False)

    class Meta:
        model = SubProgram
        fields = '__all__'

    def create(self, validated_data):
        # Extract the arrays before creating the main program
        activities_data = validated_data.pop('activities', [])
        impacts_data = validated_data.pop('impacts', [])
        
        program = SubProgram.objects.create(**validated_data)
        
        # Create nested items
        for act in activities_data:
            ProgramActivity.objects.create(subprogram=program, **act)
        for imp in impacts_data:
            ProgramImpact.objects.create(subprogram=program, **imp)
            
        return program

    def update(self, instance, validated_data):
        activities_data = validated_data.pop('activities', [])
        impacts_data = validated_data.pop('impacts', [])
        
        # Update main fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update Activities (Clear old ones and recreate to ensure clean sync)
        instance.activities.all().delete()
        for act in activities_data:
            act.pop('id', None) # Remove React's temp ID if it exists
            ProgramActivity.objects.create(subprogram=instance, **act)

        # Update Impacts
        instance.impacts.all().delete()
        for imp in impacts_data:
            imp.pop('id', None)
            ProgramImpact.objects.create(subprogram=instance, **imp)

        return instance



class BigStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = BigStat
        fields = '__all__'

class PillarStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = PillarStat
        fields = ['number', 'unit']

class PillarSerializer(serializers.ModelSerializer):
    stats = PillarStatSerializer(many=True, read_only=True)

    class Meta:
        model = Pillar
        fields = ['title', 'icon_name', 'color', 'bg_color', 'stats']

class SuccessStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SuccessStory
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'

class LeadershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leadership
        fields = ['id', 'name', 'role', 'image', 'category', 'bio', 'order']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        if instance.image and request:
            representation['image'] = request.build_absolute_uri(instance.image.url)
        return representation

class ArticleSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=False)

    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'file', 'created_at']


class EventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventImage
        fields = ['image']



class EventSerializer(serializers.ModelSerializer):
    status = serializers.ReadOnlyField()
    images = EventImageSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'event_date', 
            'start_time', 'end_time', 'location', 'status', 'images'
        ]



class EventCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Event
        fields = [
            'title', 'description', 'event_date',
            'start_time', 'end_time', 'location', 'images'
        ]

    def create(self, validated_data):
        images = validated_data.pop('images', [])
        event = Event.objects.create(**validated_data)
        for image in images:
            EventImage.objects.create(event=event, image=image)
        return event

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'



class VolunteerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Volunteer
        fields = '__all__'

class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = '__all__'

class DonateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donate
        fields = '__all__'


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = "__all__"
