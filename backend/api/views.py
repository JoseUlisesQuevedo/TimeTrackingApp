from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, ProjectSerializer, TimeEntrySerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Project, TimeEntry


class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
# Create your views here.

class TimeEntryListCreate(generics.ListCreateAPIView):
    serializer_class = TimeEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TimeEntry.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user_id=self.request.user)
        else:
            print(serializer.errors)

class TimeEntryUpdate(generics.RetrieveUpdateAPIView):

    def get_queryset(self):
        return TimeEntry.objects.filter(user=self.request.user)
   
    serializer_class = TimeEntrySerializer
    permission_classes = [IsAuthenticated]

class ProjectListCreate(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Project.objects.all()
    
    def perform_create(self, serializer):
        if serializer.is_valid():  
            serializer.save(created_by=self.request.user)
        else:
            print(serializer.errors)

class ProjectDelete(generics.DestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_destroy(self, instance):
        instance.delete()

class ProjectUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]  # Requires authentication
