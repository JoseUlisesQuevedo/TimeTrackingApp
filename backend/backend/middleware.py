from django.http import HttpResponse
from django.utils.deprecation import MiddlewareMixin
import os

class HealthCheckMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.META["PATH_INFO"] == "/ping/":
            print(os.getenv("POSTGRES_PORT"))
            return HttpResponse("pong")