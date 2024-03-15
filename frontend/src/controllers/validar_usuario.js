import config from '../config/config.json';

const host = config.host;

document.addEventListener('DOMContentLoaded', function () {
    const target_message = document.querySelector('#target-message')
    const loginForm = document.getElementById('login-form');
    const submitButton = loginForm.querySelector('#button-submit-login'); // Selecciona el botón de envío del formulario

    submitButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevenir el envío del formulario por defecto

        // datos del formulario
        const formData = new FormData(loginForm);
        const formDataObject = {};

        // Convertir formulario a un objeto
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        // Convertir el objeto a JSON
        const jsonData = JSON.stringify(formDataObject);
        console.log(jsonData)

        // peticion a servicio PHP
        fetch(`${host}/services/service_validate_user.php`, {
            method: 'POST',
            body: jsonData,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json(); //respuesta correcta y retorna en JSON
                } else {
                    console.error('Error al enviar los datos');
                    return response.json();
                }
            })
            .then(data => {
                console.log(data);
                if (data.status === 'success') {
                    localStorage.setItem('email', formDataObject.email);//autenticacion exitosa - guarda el email en localstorage
                    createTarget(data.message, 0);
                } else {
                    createTarget(data.message, 1);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    //mostrar el mensaje en el frontend
    const createTarget = (message, caseType) => {
        target_message.classList.remove('hidden');
        let span;
    
        switch (caseType) {
            case 0:
                // En caso de registro exitoso
                span = `<span class="font-medium text-green-500">Success! ${message}</span>`;
                break;
            case 1:
                // En caso de error
                span = `<span class="font-medium text-red-800">Something went wrong: ${message}</span>`;
                break;
            default:
                // Caso predeterminado
                span = `<span class="font-medium">${message}</span>`;
        }
    
        // Insertar el mensaje en el elemento target_message
        target_message.innerHTML = span;
    
        // Ocultar el mensaje después de 3 segundos y redirigir si es un registro exitoso
        setTimeout(() => {
            target_message.classList.add('hidden');
            if (caseType === 0) {
                location.href = "/infopokemon";
            }
        }, 1000);
    };
    
});
