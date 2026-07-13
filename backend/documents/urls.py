from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_document, name='upload_document'),
    path('upload_text/', views.upload_text, name='upload_text'),
    path('', views.list_documents, name='list_documents'),
    path('<int:doc_id>/', views.delete_document, name='delete_document'),
]
