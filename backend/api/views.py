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
class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class TimeEntryListCreate(generics.ListCreateAPIView):
    serializer_class = TimeEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = TimeEntry.objects.filter(user=self.request.user)
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
            
            
        if start_date and end_date:
            start_date = start_date.split('T')[0]
            end_date = end_date.split('T')[0]
            queryset = queryset.filter(entry_date__range=[start_date, end_date])
        elif start_date:
            start_date = start_date.split('T')[0]
            queryset = queryset.filter(entry_date__gte=start_date)
        elif end_date:
            end_date = end_date.split('T')[0]

            queryset = queryset.filter(entry_date__lte=end_date)
        return queryset
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)

class TimeEntryUpdate(generics.RetrieveUpdateAPIView):

    def get_queryset(self):
        return TimeEntry.objects.filter(user=self.request.user)
   
    serializer_class = TimeEntrySerializer
    permission_classes = [IsAuthenticated]

class TimeEntryDelete(generics.DestroyAPIView):
    queryset = TimeEntry.objects.all()
    serializer_class = TimeEntrySerializer
    permission_classes = [IsAuthenticated]
    
    def perform_destroy(self, instance):
        instance.delete()
        
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
