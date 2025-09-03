from django.urls import path
from .views import *

urlpatterns = [
    path('usuarios/', class1.as_view()),
    path('usuarios/<int:id>/', class2.as_view()),
]