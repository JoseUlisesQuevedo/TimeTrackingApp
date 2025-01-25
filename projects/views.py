from django.shortcuts import render
from rest_framework.decorators import api_view
from .serializers import ProjectSerializer
from .models import Project
from rest_framework.response import Response


# Create your views here.
@api_view(['GET'])
def get_projects(request):
    all_projects = Project.objects.all()
    serializer = ProjectSerializer(all_projects, many=True)
    return Response(serializer.data)