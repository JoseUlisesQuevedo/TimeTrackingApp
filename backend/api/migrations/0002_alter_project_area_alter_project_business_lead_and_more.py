# Generated by Django 5.1.5 on 2025-01-30 16:29

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='area',
            field=models.CharField(choices=[('C', 'Consulting'), ('II', 'Internal Initiative'), ('OTH', 'Other')], default='OTH', max_length=3, null=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='business_lead',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='business_lead_projects', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='project',
            name='description',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='end_date',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='start_date',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='status',
            field=models.CharField(choices=[('A', 'Active'), ('OH', 'On hold'), ('C', 'Completed')], default='OH', max_length=3, null=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='tech_lead',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='tech_lead_projects', to=settings.AUTH_USER_MODEL),
        ),
    ]
