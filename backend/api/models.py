from django.db import models
from django.contrib.auth.models import User


class Project(models.Model):

    #Project description
    project_name = models.CharField(max_length=100)
    description = models.TextField(null=True)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)

    #Project responsabilities
    tech_lead = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tech_lead_projects',null=True)
    business_lead = models.ForeignKey(User, on_delete=models.CASCADE,related_name = 'business_lead_projects',null=True)

    #Area and status
    AREA_CHOICES = [
        ('C', 'Consulting'),
        ('II', 'Internal Initiative'),
        ('OTH', 'Other')
    ]
    area = models.CharField(
    max_length=3, choices=AREA_CHOICES,null=True,default='OTH')

    STATUS_CHOICES = [
        ('A', 'Active'),
        ('OH', 'On hold'),
        ('C', 'Completed')]
    status = models.CharField(
    max_length=3, choices=STATUS_CHOICES,null=True,default='OH')

    #Metadata    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.project_name

class TimeEntry(models.Model):

    #How many minutes in that day
    duration = models.FloatField()
    #Who registers the time
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='time_entries')
    #To which project
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='time_entries')
    #For what day
    entry_date = models.DateField()

    #When is the entry created and updated
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.project.project_name} - {self.entry_date} - {self.duration} hours"