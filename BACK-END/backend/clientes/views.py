from rest_framework.views import APIView
from django.http import JsonResponse, Http404
from rest_framework.response import Response
from http import HTTPStatus
from django.http import Http404
from django.utils.text import slugify
from .models import *
from .serializers import *
from django.core.files.storage import FileSystemStorage
from django.core.exceptions import ObjectDoesNotExist

# Create your views here.
class class1(APIView):

    def get(self,request):
        data=Cliente.objects.order_by('-id').all()
        serializer=ClienteSerializer(data, many=True, context={'request': request})
        return JsonResponse ({"data":serializer.data})
    
    def post(self, request):
        nombre = request.data.get('nombre')
        correo = request.data.get('correo')
        fecha_inscripcion = request.data.get('fecha_inscripcion')
        fecha_vencimiento = request.data.get('fecha_vencimiento')
        tipo_vehiculo = request.data.get('tipo_vehiculo')
        cobro = request.data.get('cobro')
        celular = request.FILES.get('celular')
        empleado = request.FILES.get('empleado')
        lugar = request.FILES.get('lugar')

        if not nombre or not correo or not fecha_inscripcion or not fecha_vencimiento or not tipo_vehiculo or not cobro or not celular or not empleado or not lugar:
            return JsonResponse({"Estado": "Error", "Mensaje": "Todos los campos tiene  que estar llenos"}, status=HTTPStatus.BAD_REQUEST)

        try:
            nuevo = Cliente.objects.create(
                                                nombre=nombre,
                                                correo=correo,
                                                fecha_inscripcion=fecha_inscripcion,
                                                fecha_vencimiento=fecha_vencimiento,
                                                tipo_vehiculo=tipo_vehiculo,
                                                cobro=cobro,
                                                celular=celular,
                                                empleado=empleado,
                                                lugar=lugar
            )
            return JsonResponse({"Estado": "Ok", "Mensaje": "Registro creado correctamente"})
        except Exception as e:
            return JsonResponse({"Estado": "Error", "Mensaje": str(e)}, status=HTTPStatus.BAD_REQUEST)

class class2(APIView):

    def get(self,request,id):
        try:
            data=Cliente.objects.get(id=id)
            serializer=ClienteSerializer(data, context={'request': request})
            return JsonResponse ({"data":serializer.data})
        except Cliente.DoesNotExist:
            return JsonResponse({"Estado": "Error", "Mensaje": "Usuario no encontrado"}, status=HTTPStatus.BAD_REQUEST)

    def put(self,request,id):
        nombre = request.data.get('nombre')
        correo = request.data.get('correo')
        fecha_inscripcion = request.data.get('fecha_inscripcion')
        fecha_vencimiento = request.data.get('fecha_vencimiento')
        tipo_vehiculo = request.data.get('tipo_vehiculo')
        cobro = request.data.get('cobro')
        celular = request.FILES.get('celular')
        empleado = request.FILES.get('empleado')
        lugar_registro = request.FILES.get('lugar')
        try:
            User = Cliente.objects.get(id=id)
        except:
            raise Http404("Producto no encontrado")
        
        if not nombre or not correo or not fecha_inscripcion or not fecha_vencimiento or not tipo_vehiculo or not cobro or not celular or not empleado or not lugar_registro:
            return JsonResponse({"Estado": "Error", "Mensaje": "Todos los campos tiene  que estar llenos"}, status=HTTPStatus.BAD_REQUEST)
        
        
        User.nombre=nombre
        User.correo=correo
        User.fecha_inscripcion=fecha_inscripcion
        User.fecha_vencimiento=fecha_vencimiento
        User.tipo_vehiculo=tipo_vehiculo
        User.cobro=cobro
        User.celular=celular
        User.empleado=empleado
        User.lugar_registro=lugar_registro
        
        try:
            User.save()
            return JsonResponse({"Estado":"Ok","Mensaje":"Se modifico el elemento correctamente"},
                status=HTTPStatus.OK)
        except Cliente.DoesNotExist:
            raise Http404

    def delete(self,request,id):
        try:
            Cliente.objects.filter(id=id).delete()
            return JsonResponse({"estado":"ok","mensaje":"eliminado correctamente"},status=HTTPStatus.OK)
        
        except Cliente.DoesNotExist:
            raise Http404