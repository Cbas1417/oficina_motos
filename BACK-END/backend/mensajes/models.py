from django.db import models
from autoslug import AutoSlugField
from django.contrib.auth.models import User

# Create your models here.

from django.db import models

class Mensaje(models.Model):
    FRECUENCIA_CHOICES = [
        ("diario", "Diario"),
        ("semanal", "Semanal"),
        ("mensual", "Mensual"),
        ("personalizado", "Personalizado"),
    ]
    TIPO_CHOICES = [
        ("general", "General"),
        ("soat", "Recordatorio de SOAT"),
    ]
    titulo = models.CharField(max_length=100,null=False,blank=False)
    descripcion = models.CharField(max_length=255)
    mensaje = models.TextField()

    # Cada cuánto se envía
    frecuencia = models.CharField(
        max_length=20,
        choices=FRECUENCIA_CHOICES,
        default="diario"
    )

    # Solo aplica si frecuencia = personalizado
    dias_personalizado = models.PositiveIntegerField(
        null=True, blank=True,
        help_text="Número de días si la frecuencia es personalizada"
    )

    tipo = models.CharField(
        max_length=20,
        choices=TIPO_CHOICES,
        default="general"
    )

    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.descripcion} ({self.get_tipo_display()})"


class RecordatorioSOAT(models.Model):
    mensaje = models.OneToOneField(
        Mensaje,
        on_delete=models.CASCADE,
        related_name="recordatorio_soat"
    )
    cantidad_recordatorios = models.PositiveIntegerField(default=1)

    # Guardamos los días antes del vencimiento
    dias_antes = models.JSONField(
        help_text="Lista de días antes del vencimiento para enviar recordatorio"
    )

    def __str__(self):
        return f"SOAT - {self.mensaje.descripcion}"
