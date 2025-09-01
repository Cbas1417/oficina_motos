from django.db import models
from autoslug import AutoSlugField
from django.contrib.auth.models import User

# Create your models here.

from django.db import models

class Cliente(models.Model):
    tipos_documento = [
        ('cc', 'Cédula de Ciudadanía'),
        ('ti', 'Tarjeta de Identidad'),
        ('ce', 'Cédula de Extranjería'),
        ('pas', 'Pasaporte'),
        ('nit', 'NIT'),
    ]

    tipo_documento = models.CharField(max_length=3, choices=tipos_documento, default='cc')
    nombre = models.CharField(max_length=100, verbose_name="Nombre de usuario")
    slug = AutoSlugField(populate_from='nombre', unique=True, blank=True, null=True)
    fecha_inscripcion = models.DateField(verbose_name="Fecha de Inscripción")
    fecha_vencimiento = models.DateField(verbose_name="Fecha de Vencimiento")
    tipo_vehiculo = models.CharField(max_length=50, verbose_name="Tipo de vehiculo")
    correo = models.EmailField()
    telefono = models.CharField(max_length=20)

    class Meta:
        db_table = 'cliente'
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'