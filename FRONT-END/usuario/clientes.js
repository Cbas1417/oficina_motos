const tbody = document.getElementById("clientes-cuerpo");

window.clientes = [  
    { id: 1, nombre: "Carlos Pérez", registro: "2025-08-10", fin: "2025-09-10", tipov: "Moto", cobro:192000, celular:"3005670124",correo:"carlos@gmail.com", empleado:"Sebas", lugar:"Caldas" },
    { id: 2, nombre: "Laura Gómez", registro: "2025-07-05", fin: "2025-08-05", tipov: "Carro", cobro:195000, celular:"3007270124",correo:"Laura@gmail.com", empleado:"Isabela", lugar:"Caldas" },
    { id: 3, nombre: "Pedro Ruiz", registro: "2025-06-20", fin: "2025-07-20", tipov: "Moto", cobro:200000, celular:"3005656124",correo:"Pedro@gmail.com", empleado:"Daniel", lugar:"Envigado" }
];

window.renderTabla = function renderTabla() {
    tbody.innerHTML = "";

    window.clientes.forEach((cliente, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><input type="text" value="${cliente.id}" disabled></td>
            <td><input type="text" value="${cliente.nombre}" disabled></td>
            <td><input type="date" value="${cliente.registro}" disabled></td>
            <td><input type="date" value="${cliente.fin}" disabled></td>
            <td><input type="text" value="${cliente.tipov}" disabled></td>
            <td><input type="text" value="${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cliente.cobro)}" disabled></td>
            <td><input type="text" value="${cliente.celular}" disabled></td>
            <td><input type="email" value="${cliente.correo}" disabled></td>
            <td><input type="text" value="${cliente.empleado}" disabled></td>
            <td><input type="text" value="${cliente.lugar}" disabled></td>
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
