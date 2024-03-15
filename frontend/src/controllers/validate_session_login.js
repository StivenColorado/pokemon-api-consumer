document.addEventListener('DOMContentLoaded', function() {
    const userEmail = localStorage.getItem('email');
    if (userEmail) {
        window.location.href = '/';
    } else {
        // Si userEmail es null, no hay ningún valor almacenado en el localStorage
    }
});
