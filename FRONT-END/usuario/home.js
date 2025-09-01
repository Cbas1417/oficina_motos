const contenedor = document.getElementById("mensajes");

window.mensajes = [
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
      abrirModal(mensajes[editIndex], editIndex);
    });
  });
}

window.addEventListener('DOMContentLoaded', renderizarMensajes);

window.renderizarMensajes = renderizarMensajes;