const tbody = document.getElementById("clientes-cuerpo");

window.clientes = [  
    { id: 1, nombre: "Carlos Pérez", usuario: "Cperez",correo:"carlos@gmail.com" ,contraseña:"154Carlos",celular:"3005670124" },
    { id: 2, nombre: "Laura Gómez", usuario: "Lgomez", correo:"Laura@gmail.com", contraseña:"178Laura",celular:"3005780124"},
    { id: 3, nombre: "Pedro Ruiz", usuario: "Pruiz",correo:"Pedro@gmail.com", contraseña:"784Pedro",celular:"3015770124" }
];

window.renderTabla = function renderTabla() {
    tbody.innerHTML = "";

    window.clientes.forEach((cliente, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><input type="text" value="${cliente.id}" disabled></td>
            <td><input type="text" value="${cliente.nombre}" disabled></td>
            <td><input type="text" value="${cliente.usuario}" disabled></td>
            <td><input type="email" value="${cliente.correo}" disabled></td>
            <td><input type="text" value="${cliente.contraseña}" disabled></td>
            <td><input type="text" value="${cliente.celular}" disabled></td>
            <td>
                <i class="fa-solid fa-pen-to-square btn-editar" style="cursor:pointer; margin-right:8px;"></i>
                <i class="fa-solid fa-trash btn-eliminar" style="cursor:pointer;"></i>
            </td>
        `;

        // Botón Eliminar
        const btnEliminar = row.querySelector(".btn-eliminar");
        btnEliminar.addEventListener("click", () => {
            window.clientes.splice(index, 1); 
            window.renderTabla();
        });

        tbody.appendChild(row);
    });
};

window.renderTabla();
