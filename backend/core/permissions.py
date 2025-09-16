# Permissions v1.1.0

from rest_framework import permissions
from django.conf import settings

class HasAPIKey(permissions.BasePermission):
    message = 'Autenticação inválida ou ausente.'
    def has_permission(self, request, view):
        api_key_sent = request.META.get('HTTP_X_API_KEY')
        if not api_key_sent:
            return False
        return api_key_sent == settings.API_KEY