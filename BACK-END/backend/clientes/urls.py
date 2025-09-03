from django.urls import path
from .views import *

urlpatterns = [
    path('clientes/', class1.as_view()),
    path('clientes/<int:id>/', class2.as_view()),
]
