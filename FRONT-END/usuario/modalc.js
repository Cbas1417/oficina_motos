// Botón "Agregar" abre modal en modo CREAR
add.addEventListener("click", () => cargarModal());


document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-editar")) {
    const row = e.target.closest("tr");
    const index = row.rowIndex - 1; 
    cargarModal(window.clientes[index], index); 
  }
});

async function cargarModal(cliente = null, index = null) {
  const res = await fetch("modalc.html");
  const html = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.querySelectorAll("link[rel='stylesheet'], style").forEach(el => {
    document.head.appendChild(el.cloneNode(true));
  });

  document.querySelector("#modalContainer").innerHTML = doc.body.innerHTML;


  const cerrar = document.querySelector(".cerrar");
  if (cerrar) {
    cerrar.addEventListener("click", () => {
      document.querySelector("#modalContainer").innerHTML = "";
    });
  }

  const form = document.querySelector(".modal-content");
  const boton = form.querySelector(".btn, .crear"); 

  if (cliente) {
    if (boton) boton.textContent = "Editar";
    document.getElementById("nombre").value = cliente.nombre;
    document.getElementById("fecha_inscripcion").value = cliente.registro;
    document.getElementById("fecha_vencimiento").value = cliente.fin;
    document.getElementById("tipo_vehiculo").value = cliente.tipov;
    document.getElementById("cobro").value = cliente.cobro;
    document.getElementById("celular").value = cliente.celular;
    document.getElementById("empleado").value = cliente.empleado;
    document.getElementById("lugar").value = cliente.lugar;
  } else {
    if (boton) boton.textContent = "Crear";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const clienteEditado = {
      id: cliente ? cliente.id : window.clientes.length + 1,
      nombre: document.getElementById("nombre").value,
      registro: document.getElementById("fecha_inscripcion").value,
      fin: document.getElementById("fecha_vencimiento").value,
      tipov: document.getElementById("tipo_vehiculo").value,
      cobro: document.getElementById("cobro").value,
      celular: document.getElementById("celular").value,
      empleado: document.getElementById("empleado").value,
      lugar: document.getElementById("lugar").value,
    };

    if (cliente) {
      window.clientes[index] = clienteEditado;
    } else {
      window.clientes.push(clienteEditado);
    }

    window.renderTabla();
    
    form.reset();
    document.querySelector("#modalContainer").innerHTML = "";
  });
}
