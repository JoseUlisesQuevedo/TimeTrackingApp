from django.urls import path
from . import views

urlpatterns = [
    path("projects/",views.ProjectListCreate.as_view(), name="project-list-create"),
    path("projects/delete/<int:pk>/",views.ProjectDelete.as_view(), name="project-delete"),
    path("projects/update/<int:pk>/",views.ProjectUpdateView.as_view(), name="project-update"),
    path("timeEntries/",views.TimeEntryListCreate.as_view(), name="time-entry-list-create"),
    path("timeEntries/update/<int:pk>/",views.TimeEntryUpdate.as_view(), name="time-entry-update"),
    path("timeEntries/delete/<int:pk>/",views.TimeEntryDelete.as_view(), name="time-entry-delete"),
]
