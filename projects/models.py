from django.db import models

# Create your models here.
class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()

    AREA_CHOICES = [
        ('C', 'Consulting'),
        ('I', 'Internal Initiative'),
        ('P', 'Product Development'),
    ]
    area = models.CharField(max_length=2,choices=AREA_CHOICES)
    
    STATUS_CHOICES = [
        ('A', 'Active'),
        ('OH', 'On hold'),
        ('C', 'Completed')
    ]
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='A')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.area} - {self.status}"