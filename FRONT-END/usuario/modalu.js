
add.addEventListener("click", () => cargarModal());

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-editar")) {
        const row = e.target.closest("tr");
        const index = row.rowIndex - 1;
        cargarModal(window.clientes[index], index);
    }
});

async function cargarModal(cliente = null, index = null) {
    const res = await fetch("modalu.html");
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
        document.getElementById("nombreu").value = cliente.usuario;
        document.getElementById("correo").value = cliente.correo;
        document.getElementById("contraseña").value = cliente.contraseña;
        document.getElementById("celular").value = cliente.celular;
    } else {
        if (boton) boton.textContent = "Crear";
    }

    
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const clienteEditado = {
            id: cliente ? cliente.id : window.clientes.length + 1,
            nombre: document.getElementById("nombre").value,
            usuario: document.getElementById("nombreu").value,
            correo: document.getElementById("correo").value,
            contraseña: document.getElementById("contraseña").value,
            celular: document.getElementById("celular").value,
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
