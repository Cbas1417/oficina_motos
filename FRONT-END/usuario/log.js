const password = document.getElementById('password');
const correo = document.getElementById('correo');
const aviso = document.getElementById('aviso');

const form = document.getElementById('formulario');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (password.value === '' || correo.value === '' || password.value.search(/[a-z]/i) < 0) {
        aviso.textContent = 'Por favor, completa todos los campos.';
        return;
    }

    if(correo.value.search(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) < 0) {
        aviso.textContent = 'Por favor, ingresa un correo electrónico válido.';
        return;
    }
    if (password.value.length < 8) {
        aviso.textContent = 'La contraseña debe tener al menos 8 caracteres.'
        return;
    }

    if(password.value === password.value.toLowerCase()) {
        aviso.textContent = "La contraseña debe contener al menos una letra mayúscula.";
        return;
    }

    if( password.value === password.value.toUpperCase()) {
        aviso.textContent = "La contraseña debe contener al menos una letra minúscula.";
        return;
    }

    if(!/\d/.test(password.value)) {
        aviso.textContent = "La contraseña debe contener al menos un número.";
        return;
    }

    const datos = {
        password: password.value,
        correo: correo.value
    };

    aviso.textContent = 'Formulario enviado correctamente.';
    aviso.style.color = 'green';
    
    console.log('Datos enviados:', datos);

    const esperar = new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 920); 
    });

    esperar.then(() => {
        window.location.href = 'home.html'; 
    });

});