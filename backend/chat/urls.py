from django.urls import path
from . import views

urlpatterns = [
    path('new/', views.new_chat, name='new_chat'),
    path('history/', views.chat_history, name='chat_history'),
    path('<int:session_id>/', views.get_session, name='get_session'),
    path('<int:session_id>/delete/', views.delete_chat, name='delete_chat'),
    path('ask/', views.ask_question, name='ask_question'),
]
