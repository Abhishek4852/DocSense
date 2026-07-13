from django.db import models
from accounts.models import Organization

class Document(models.Model):
    STATUS_CHOICES = (
        ('PROCESSING', 'Processing'),
        ('READY', 'Ready'),
        ('FAILED', 'Failed'),
    )
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='documents/')
    document_type = models.CharField(max_length=50, default='General')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PROCESSING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
