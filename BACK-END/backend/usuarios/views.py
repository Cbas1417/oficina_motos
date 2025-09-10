from rest_framework.views import APIView
from django.http import JsonResponse, Http404
from rest_framework.response import Response
from http import HTTPStatus
from django.http import Http404
from django.utils.text import slugify
from .models import *
from .serializers import *
from django.core.files.storage import FileSystemStorage
from datetime import datetime
from django.core.exceptions import ObjectDoesNotExist

# Create your views here.
class class1(APIView):

    def get(self,request):
        data=Usuario.objects.order_by('-id').all()
        serializer=UsuarioSerializer(data, many=True, context={'request': request})
        return JsonResponse ({"data":serializer.data})
    
    def post(self, request):
        nombre = request.data.get('nombre')
        usuario = request.data.get('usuario')
        contraseña = request.data.get('contraseña')
        celular = request.FILES.get('celular')

        if not nombre  or not usuario or not contraseña or not celular:
            return JsonResponse({"Estado": "Error", "Mensaje": "Todos los campos tiene  que estar llenos"}, status=HTTPStatus.BAD_REQUEST)

        try:
            nuevo = Usuario.objects.create(
                                                nombre=nombre,
                                                usuario=usuario,
                                                contraseña=contraseña,
                                                celular=celular
            )
            return JsonResponse({"Estado": "Ok", "Mensaje": "Registro creado correctamente"})
        except Exception as e:
            return JsonResponse({"Estado": "Error", "Mensaje": str(e)}, status=HTTPStatus.BAD_REQUEST)

class class2(APIView):

    def get(self,request,id):
        try:
            data=Usuario.objects.get(id=id)
            serializer=UsuarioSerializer(data, context={'request': request})
            return JsonResponse ({"data":serializer.data})
        except Usuario.DoesNotExist:
            return JsonResponse({"Estado": "Error", "Mensaje": "Usuario no encontrado"}, status=HTTPStatus.BAD_REQUEST)

    def put(self,request,id):
        nombre = request.data.get('nombre')
        usuario = request.data.get('usuario')
        contraseña = request.data.get('contraseña')
        celular = request.FILES.get('celular')
        try:
            User = Usuario.objects.get(id=id)
        except:
            raise Http404("Producto no encontrado")
        
        if not nombre  or not usuario or not contraseña or not celular:
            return JsonResponse({"Estado": "Error", "Mensaje": "Todos los campos tiene  que estar llenos"}, status=HTTPStatus.BAD_REQUEST)
        
        
        User.nombre=nombre
        User.usuario=usuario
        User.contraseña=contraseña
        User.celular=celular
        
        try:
            User.save()
            return JsonResponse({"Estado":"Ok","Mensaje":"Se modifico el elemento correctamente"},
                status=HTTPStatus.OK)
        except Usuario.DoesNotExist:
            raise Http404

    def delete(self,request,id):
        try:
            Usuario.objects.filter(id=id).delete()
            return JsonResponse({"estado":"ok","mensaje":"eliminado correctamente"},status=HTTPStatus.OK)
        
        except Usuario.DoesNotExist:
            raise Http404