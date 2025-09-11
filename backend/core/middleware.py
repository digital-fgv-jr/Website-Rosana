from django.conf import settings

class SubdomainURLConfMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        host = request.get_host().split(':')[0]
        if host == settings.ADMIN_DOMAIN:
            request.urlconf = 'backend.admin_urls'
        if host == settings.API_DOMAIN:
            request.urlconf = 'backend.api_urls'
        response = self.get_response(request)
        
        return response