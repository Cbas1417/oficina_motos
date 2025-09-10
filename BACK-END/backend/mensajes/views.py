import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Mensaje, RecordatorioSOAT


# Listar todos los mensajes
def api_mensaje_list(request):
    mensajes = Mensaje.objects.all().values()
    return JsonResponse(list(mensajes), safe=False)


# Detalle de un mensaje
def api_mensaje_detail(request, pk):
    mensaje = get_object_or_404(Mensaje, pk=pk)
    data = {
        "id": mensaje.id,
        "descripcion": mensaje.descripcion,
        "mensaje": mensaje.mensaje,
        "frecuencia": mensaje.frecuencia,
        "intervalo_dias": mensaje.intervalo_dias,
        "tipo": mensaje.tipo,
        "recordatorios": list(mensaje.recordatorios.values("id", "dias_antes")),
    }
    return JsonResponse(data)


# Crear mensaje
@csrf_exempt
def api_mensaje_create(request):
    if request.method == "POST":
        data = json.loads(request.body)
        mensaje = Mensaje.objects.create(
            descripcion=data.get("descripcion"),
            mensaje=data.get("mensaje"),
            frecuencia=data.get("frecuencia"),
            intervalo_dias=data.get("intervalo_dias"),
            tipo=data.get("tipo"),
        )
        if mensaje.tipo == "soat":
            for r in data.get("recordatorios", []):
                RecordatorioSOAT.objects.create(mensaje=mensaje, dias_antes=r)
        return JsonResponse({"id": mensaje.id, "status": "created"})
    return JsonResponse({"error": "Método no permitido"}, status=405)


# Actualizar mensaje
@csrf_exempt
def api_mensaje_update(request, pk):
    mensaje = get_object_or_404(Mensaje, pk=pk)
    if request.method == "PUT":
        data = json.loads(request.body)
        mensaje.descripcion = data.get("descripcion", mensaje.descripcion)
        mensaje.mensaje = data.get("mensaje", mensaje.mensaje)
        mensaje.frecuencia = data.get("frecuencia", mensaje.frecuencia)
        mensaje.intervalo_dias = data.get("intervalo_dias", mensaje.intervalo_dias)
        mensaje.tipo = data.get("tipo", mensaje.tipo)
        mensaje.save()

        if mensaje.tipo == "soat":
            mensaje.recordatorios.all().delete()
            for r in data.get("recordatorios", []):
                RecordatorioSOAT.objects.create(mensaje=mensaje, dias_antes=r)

        return JsonResponse({"id": mensaje.id, "status": "updated"})
    return JsonResponse({"error": "Método no permitido"}, status=405)


# Eliminar mensaje
@csrf_exempt
def api_mensaje_delete(request, pk):
    mensaje = get_object_or_404(Mensaje, pk=pk)
    if request.method == "DELETE":
        mensaje.delete()
        return JsonResponse({"status": "deleted"})
    return JsonResponse({"error": "Método no permitido"}, status=405)