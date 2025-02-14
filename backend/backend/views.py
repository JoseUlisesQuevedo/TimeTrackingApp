from django.shortcuts import render

def index(request):
    return render(request, 'index.html')

def projects(request):
    return render(request, 'project-details.html')

def time_entry(request):
    return render(request, 'time-entries.html')
