// Arreglo con la información
const clientes = [
    { id: 1, nombre: "Carlos Pérez", placa: "ABC123", registro: "2025-08-10", fin: "2025-09-10" },
    { id: 2, nombre: "Laura Gómez", placa: "XYZ987", registro: "2025-07-05", fin: "2025-08-05" },
    { id: 3, nombre: "Pedro Ruiz", placa: "JKL456", registro: "2025-06-20", fin: "2025-07-20" }
];

const tbody = document.getElementById("clientes-body");

// Función para renderizar la tabla
function renderTabla() {
    tbody.innerHTML = "";

    clientes.forEach((cliente, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><input type="text" value="${cliente.id}" disabled></td>
            <td><input type="text" value="${cliente.nombre}" disabled></td>
            <td><input type="text" value="${cliente.placa}" disabled></td>
            <td><input type="date" value="${cliente.registro}" disabled></td>
            <td><input type="date" value="${cliente.fin}" disabled></td>
            <td>
                <i class="fa-solid fa-pen-to-square btn-editar" style="cursor:pointer; margin-right:8px;"></i>
                <i class="fa-solid fa-trash btn-eliminar" style="cursor:pointer;"></i>
            </td>
        `;

        // Botón Editar
        const btnEditar = row.querySelector(".btn-editar");
        btnEditar.addEventListener("click", () => {
            const inputs = row.querySelectorAll("input");
            const isDisabled = inputs[0].disabled;

            inputs.forEach(input => input.disabled = !isDisabled);

            // Cambiar color al estar en modo edición
            btnEditar.style.color = isDisabled ? "blue" : "black";
        });

        // Botón Eliminar
        const btnEliminar = row.querySelector(".btn-eliminar");
        btnEliminar.addEventListener("click", () => {
            clientes.splice(index, 1); // Eliminar del arreglo
            renderTabla(); // Volver a renderizar
        });

        tbody.appendChild(row);
    });
}

const add = document.getElementById("add");

add.addEventListener("click", () => {
    const nuevoCliente = {
        id: clientes.length + 1,
        nombre: "",
        placa: "",
        registro: new Date().toISOString().split("T")[0],
        fin: ""
    };

    clientes.push(nuevoCliente);
    renderTabla();
})
// Render inicial
renderTabla();
