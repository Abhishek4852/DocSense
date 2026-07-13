from django.db import models
from accounts.models import Organization

class WhatsAppConfig(models.Model):
    organization = models.OneToOneField(Organization, on_delete=models.CASCADE, related_name='whatsapp_config')
    phone_number_id = models.CharField(max_length=255)
    access_token = models.TextField()
    verify_token = models.CharField(max_length=255)
    selected_docs = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.organization.name} - WhatsApp"

class WhatsAppContact(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='whatsapp_contacts')
    phone_number = models.CharField(max_length=50)
    name = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.phone_number

class WhatsAppMessage(models.Model):
    ROLE_CHOICES = [
        ('USER', 'User'),
        ('SYSTEM', 'System'),
    ]
    contact = models.ForeignKey(WhatsAppContact, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.role} - {self.contact.phone_number}"
