<?php

session_start();

// Crear un array para almacenar la respuesta
$response = array();

// Verificar si hay una sesión activa
if (isset($_SESSION['email'])) {
    // Si hay una sesión activa, responder con código 200 (OK)
    $response['status'] = 'success';
    $response['message'] = 'Sesión activa';
} else {
    // Si no hay una sesión activa, responder con código 401 (No autorizado)
    $response['status'] = 'error';
    $response['message'] = 'No hay sesión activa';
}

// Enviar la respuesta como JSON
header('Content-Type: application/json');
echo json_encode($response);

?>
