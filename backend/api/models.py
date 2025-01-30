from django.db import models
from django.contrib.auth.models import User


class Project(models.Model):

    #Project description
    project_name = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()

    #Project responsabilities
    tech_lead = models.ForeignKey(User, on_delete=models.CASCADE)
    business_lead = models.ForeignKey(User, on_delete=models.CASCADE)

    #Area and status
    AREA_CHOICES = [
        ('C', 'Consulting'),
        ('II', 'Internal Initiative'),
        ('OTH', 'Other')
    ]
    area = models.CharField(
    max_length=3, choices=AREA_CHOICES)

    STATUS_CHOICES = [
        ('A', 'Active'),
        ('OH', 'On hold'),
        ('C', 'Completed')]
    status = models.CharField(
    max_length=3, choices=STATUS_CHOICES)

    #Metadata    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.project_name

