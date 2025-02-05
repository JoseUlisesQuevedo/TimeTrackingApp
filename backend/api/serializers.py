from django.contrib.auth.models import User, Group
from .models import Project, TimeEntry
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id","project_name", "description", "start_date", "end_date", "tech_lead", "business_lead", "area", "status"]
        read_only_fields = ["id",'created_by', 'created_at', 'updated_at']
        extra_kwargs = {'project_name': {'required': True}, 'end_date': {'required': False}}

class TimeEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeEntry
        fields = ["id","duration", "project", "entry_date"]
        read_only_fields = ["id",'created_at', 'updated_at',"user"]
        extra_kwargs = {'duration': {'required': True}, 'entry_date': {'required': True}}