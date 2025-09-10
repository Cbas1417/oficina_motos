from django.urls import path
from .views import *
from . import views_api 

urlpatterns = [
    path("api/mensajes/", views_api.api_mensaje_list, name="api_mensaje_list"),
    path("api/mensajes/<int:pk>/", views_api.api_mensaje_detail, name="api_mensaje_detail"),
    path("api/mensajes/create/", views_api.api_mensaje_create, name="api_mensaje_create"),
    path("api/mensajes/<int:pk>/update/", views_api.api_mensaje_update, name="api_mensaje_update"),
    path("api/mensajes/<int:pk>/delete/", views_api.api_mensaje_delete, name="api_mensaje_delete"),
]