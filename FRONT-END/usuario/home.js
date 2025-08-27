const abrirModal = document.getElementById('abrirModal');
const modal = document.getElementById('modal');
const formulario = document.getElementById('formulario');
const contenedor = document.getElementById("mensajes");
const tituloModal = document.getElementById('tituloModal');

const mensajes = [
  { titulo: "Mensaje 1", creador: "Usuario1", descripcion: "Este es el primer mensaje.", mensaje: "Contenido 1" },
  { titulo: "Mensaje 2", creador: "Usuario2", descripcion: "Este es el segundo mensaje.", mensaje: "Contenido 2" },
  { titulo: "Mensaje 3", creador: "Usuario3", descripcion: "Este es el tercer mensaje.", mensaje: "Contenido 3" }
];

let editIndex = null;

function renderizarMensajes() { 
  contenedor.innerHTML = ""; 
  mensajes.forEach((m, index) => {
    const div = document.createElement("div");
    div.classList.add("mensajes");
    div.setAttribute("id", `mensaje-${index}`);
    div.innerHTML = `
      <h2>${m.titulo}</h2>
      <p><strong>Creado por:</strong> ${m.creador}</p>
      <p><strong>Descripción:</strong> ${m.descripcion}</p>
      <p><strong>Mensaje:</strong> ${m.mensaje}</p>
      <i class="fa-solid fa-wrench js-edit" data-index="${index}"></i>
    `;
    contenedor.prepend(div);
  });

  document.querySelectorAll(".js-edit").forEach(btn => {
    btn.addEventListener("click", (e) => {
      editIndex = e.target.dataset.index;
      const mensaje = mensajes[editIndex];

      tituloModal.textContent = "EDITAR MENSAJE";
      // Cargar datos en el formulario
      formulario.titulo.value = mensaje.titulo;
      formulario.descripcion.value = mensaje.descripcion;
      formulario.mensaje.value = mensaje.mensaje;

      // Abrir modal
      modal.style.display = "flex";
      modal.style.pointerEvents = "auto";
    });
  });
}

// abrir modal para CREAR
abrirModal.addEventListener('click', () => {
  editIndex = null;
  formulario.reset();

  tituloModal.textContent = "CREAR MENSAJE"; // ✅ Resetear aquí

  modal.style.display = 'flex';
  modal.style.pointerEvents = 'auto';
});

document.getElementById('close').addEventListener('click', () => {
  modal.style.display = 'none';
  modal.style.pointerEvents = 'none';

  //  Al cerrar,  regresam el texto a "CREAR MENSAJE"
  if (tituloModal.textContent === "EDITAR MENSAJE") {
    tituloModal.textContent = "CREAR MENSAJE";
  }
});

formulario.addEventListener('submit', (e) => {
  e.preventDefault();

  const datos = new FormData(formulario);
  const { titulo, descripcion, mensaje } = Object.fromEntries(datos.entries());

  if (editIndex !== null) {
    mensajes[editIndex] = {
      ...mensajes[editIndex], 
      titulo,
      descripcion,
      mensaje
    };
  } else {
    const nuevoMensaje = {
      titulo,
      creador: `Usuario${mensajes.length + 1}`,
      descripcion,
      mensaje
    };
    mensajes.push(nuevoMensaje);
  }

  renderizarMensajes();

  modal.style.display = 'none';
  formulario.reset();
  tituloModal.textContent = "CREAR MENSAJE"; 
});

window.addEventListener('DOMContentLoaded', renderizarMensajes);