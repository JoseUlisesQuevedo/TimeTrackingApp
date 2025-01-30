# Generated by Django 5.1.5 on 2025-01-30 17:14

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_project_area_alter_project_business_lead_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='area',
            field=models.CharField(choices=[('C', 'Consulting'), ('RI', 'Research Initiative'), ('II', 'Internal Initiative'), ('OTH', 'Other')], default='OTH', max_length=3, null=True),
        ),
        migrations.CreateModel(
            name='TimeEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('duration', models.FloatField()),
                ('entry_date', models.DateField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='time_entries', to='api.project')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='time_entries', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
