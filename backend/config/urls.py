from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('api/documents/', include('documents.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/whatsapp/', include('whatsapp.urls')),
]
