import config from '../config/config.json';
const host = config.host;

document.addEventListener('DOMContentLoaded', function () {
    const target_message = document.querySelector('#target-message');
    const registerForm = document.getElementById('register-form');
    const submitButton = registerForm.querySelector('#button-submit-register');

    submitButton.addEventListener('click', function (event) {
        event.preventDefault();

        const emailInput = registerForm.querySelector('#email');
        const passwordInput = registerForm.querySelector('#password');

        // Expresión regular  correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailInput.value.trim() === '' || passwordInput.value.trim() === '') {
            createTarget('Email and password are required.', 1);
            return; 
        }

        if (!emailRegex.test(emailInput.value.trim())) {
            createTarget('Invalid email format.', 1);
            return; 
        }

        const formData = new FormData(registerForm);
        const formDataObject = {};

        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        const jsonData = JSON.stringify(formDataObject);

        fetch(`${host}/services/service_register_user.php`, {
            method: 'POST',
            body: jsonData,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === '0') {
                    console.log(data.message); // Registro exitoso
                    createTarget(data.message, 0, formDataObject.email); // Llama a la función para mostrar el mensaje de éxito y establecer la sesión
                } else {
                    console.error(data.message); // Mensaje de error
                    createTarget(data.message, 1); // Llama a la función para mostrar el mensaje de éxito
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    const createTarget = (message, Case, email) => {
        target_message.classList.remove('hidden');
        let span;

        switch (Case) {
            case 0: // En caso de registrarse
                span = `
                    <span class="font-medium text-green-500">Success! ${message}</span> !
                `;
                localStorage.setItem('email', email);
                target_message.innerHTML = span;
                setTimeout(() => {
                    target_message.classList.add('hidden');
                    location.href = "/infopokemon";
                }, 3000);
                break;
            case 1: // En caso de error
                span = `
                    <span class="font-medium text-red-800">Something was wrong ${message}!</span> 
                `;
                target_message.innerHTML = span;
                setTimeout(() => {
                    target_message.classList.add('hidden');
                }, 1000);
        }
    };
});
