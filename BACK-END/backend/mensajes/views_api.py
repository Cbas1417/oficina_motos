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
        "titulo": mensaje.titulo,
        "descripcion": mensaje.descripcion,
        "mensaje": mensaje.mensaje,
        "frecuencia": mensaje.frecuencia,
        "dias_personalizado": mensaje.dias_personalizado,  # 👈 CORREGIDO
        "tipo": mensaje.tipo,
    }

    if mensaje.tipo == "soat" and hasattr(mensaje, "recordatorio_soat"):
        data["recordatorio_soat"] = {
            "id": mensaje.recordatorio_soat.id,
            "cantidad_recordatorios": mensaje.recordatorio_soat.cantidad_recordatorios,
            "dias_antes": mensaje.recordatorio_soat.dias_antes,
        }

    return JsonResponse(data)


# Crear mensaje
@csrf_exempt
def api_mensaje_create(request):
    if request.method == "POST":
        data = json.loads(request.body)
        mensaje = Mensaje.objects.create(
            titulo=data.get("titulo"),  # 👈 también debes enviar titulo
            descripcion=data.get("descripcion"),
            mensaje=data.get("mensaje"),
            frecuencia=data.get("frecuencia"),
            dias_personalizado=data.get("dias_personalizado"),  # 👈 CORREGIDO
            tipo=data.get("tipo"),
        )
        if mensaje.tipo == "soat":
            RecordatorioSOAT.objects.create(
                mensaje=mensaje,
                cantidad_recordatorios=len(data.get("recordatorios", [])),
                dias_antes=data.get("recordatorios", [])
            )
        return JsonResponse({"id": mensaje.id, "status": "created"})
    return JsonResponse({"error": "Método no permitido"}, status=405)


# Actualizar mensaje
@csrf_exempt
def api_mensaje_update(request, pk):
    mensaje = get_object_or_404(Mensaje, pk=pk)
    if request.method == "PUT":
        data = json.loads(request.body)

        mensaje.titulo = data.get("titulo", mensaje.titulo)
        mensaje.descripcion = data.get("descripcion", mensaje.descripcion)
        mensaje.mensaje = data.get("mensaje", mensaje.mensaje)
        mensaje.frecuencia = data.get("frecuencia", mensaje.frecuencia)
        mensaje.dias_personalizado = data.get("dias_personalizado", mensaje.dias_personalizado)  # 👈 CORREGIDO
        mensaje.tipo = data.get("tipo", mensaje.tipo)
        mensaje.save()

        # Si el tipo es SOAT, actualizamos el recordatorio
        if mensaje.tipo == "soat":
            if hasattr(mensaje, "recordatorio_soat"):
                mensaje.recordatorio_soat.delete()

            recordatorios_data = data.get("recordatorios", [])
            if recordatorios_data:
                RecordatorioSOAT.objects.create(
                    mensaje=mensaje,
                    cantidad_recordatorios=len(recordatorios_data),
                    dias_antes=recordatorios_data,
                )

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