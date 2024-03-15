import config from '../config/config.json'
document.addEventListener('DOMContentLoaded', function () {
    const closeSessionBtn = document.getElementById('Close_session');

    closeSessionBtn.addEventListener('click', function (event) {
        event.preventDefault();

        fetch(`${config.host}/services/service_close_session.php`)
            .then(response => response.json())
            .then(data => {
                // Verificar el estado de la respuesta
                if (data.status === 'success') {
                    alert('asd')
                    // Eliminar las variables del localStorage
                    localStorage.removeItem('email');
                    localStorage.removeItem('pokemonUrl');
                    
                    // Redireccionar a la página de inicio de sesión u otra página
                    window.location.href = '/Login';
                } else {
                    localStorage.removeItem('email');
                    localStorage.removeItem('pokemonUrl');
                    window.location.href = '/Login';

                    // Mostrar un mensaje de error si la sesión no se eliminó correctamente
                    console.error('Error al cerrar sesión:', data.message);
                    // Puedes mostrar este mensaje en un elemento HTML o hacer otra acción
                }
            })
            .catch(error => {
                console.error('Error al cerrar sesión:', error);
                localStorage.removeItem('email');
                localStorage.removeItem('pokemonUrl');
                window.location.href = '/Login';
                // Manejar el error, por ejemplo, mostrando un mensaje al usuario
            });
    });
});
