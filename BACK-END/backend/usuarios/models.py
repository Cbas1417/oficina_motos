
from django.db import models
from autoslug import AutoSlugField
from django.contrib.auth.models import User

class Usuario(models.Model):
    nombre = models.CharField(max_length=100, verbose_name="Nombre",null=False,blank=False)
    slug = AutoSlugField(populate_from='nombre', unique=True, blank=True, null=True)
    usuario = models.CharField(max_length=1000,verbose_name="Usuario",null=False,blank=False)
    correo = models.EmailField(null=False,blank=False)
    contraseña = models.CharField(max_length=50,null=False,blank=False)
    celular = models.CharField(max_length=20)

    class Meta:
        db_table = 'usuario'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
