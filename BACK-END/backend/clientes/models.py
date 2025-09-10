from django.db import models
from autoslug import AutoSlugField
from django.contrib.auth.models import User

# Create your models here.

from django.db import models

class Cliente(models.Model):
    nombre = models.CharField(max_length=100, verbose_name="Nombre de usuario",null=False,blank=False)
    slug = AutoSlugField(populate_from='nombre', unique=True, blank=True, null=True)
    correo = models.EmailField(null=False,blank=False)
    fecha_inscripcion = models.DateField(verbose_name="Fecha de Inscripción",null=False,blank=False)
    fecha_vencimiento = models.DateField(verbose_name="Fecha de Vencimiento",null=False,blank=False)
    tipo_vehiculo = models.CharField(max_length=50, verbose_name="Tipo de vehiculo",null=False,blank=False)
    cobro = models.DecimalField(max_digits=10,decimal_places=2,null=False,blank=False)
    celular = models.CharField(max_length=20,null=False,blank=False)
    empleado = models.CharField(max_length=100,null=False,blank=False)
    lugar_registro = models.CharField(max_length=100,null=False,blank=False)

    class Meta:
        db_table = 'cliente'
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'