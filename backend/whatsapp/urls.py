from django.urls import path
from . import views

urlpatterns = [
    path('config/', views.whatsapp_config, name='whatsapp_config'),
    path('webhook/', views.whatsapp_webhook, name='whatsapp_webhook'),
]
