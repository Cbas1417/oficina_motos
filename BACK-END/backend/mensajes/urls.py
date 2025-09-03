from django.urls import path
from .views import *

urlpatterns = [
    path('mensajes/', class1.as_view()),
    path('mensajes/<int:id>/', class2.as_view()),
]