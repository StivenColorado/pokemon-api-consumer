<?php

session_start();

$response = array();

// Verificar si hay una sesión activa
if (isset($_SESSION['email'])) {
    $_SESSION = array();

    session_destroy();

    $response['status'] = 'success';
    $response['message'] = 'Sesión eliminada correctamente';
} else {
    // Responder con código 401 (No autorizado) y un mensaje de error
    $response['status'] = 'error';
    $response['message'] = 'No hay sesión activa';
}

header('Content-Type: application/json');
echo json_encode($response);

?>
