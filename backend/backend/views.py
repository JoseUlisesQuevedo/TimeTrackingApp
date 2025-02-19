from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required

def index(request):
    return render(request, 'index.html')


@login_required
def projects(request):
    return render(request, 'project-details.html')

@login_required
def time_entry(request):
    return render(request, 'time-entries.html')

