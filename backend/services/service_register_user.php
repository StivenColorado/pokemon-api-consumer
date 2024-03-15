<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Si la solicitud es OPTIONS, enviar una respuesta exitosa
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once('../config/connection.php');

// Verificar si se recibieron datos 
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data);

    $email = $data->email;
    $password = $data->password;

    // Encriptar la contraseña
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Verificar si el usuario ya está registrado
    $check_sql = "SELECT * FROM usuarios WHERE correo = ?";
    $check_stmt = $connection->prepare($check_sql);
    $check_stmt->bind_param("s", $email);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if ($check_result->num_rows > 0) {
        // Si el usuario ya está registrado
        http_response_code(200);
        echo json_encode(array('message' => 'El usuario ya está registrado', 'status' => '1'));
    } else {
        // Si el usuario no está registrado
        $insert_sql = "INSERT INTO usuarios (correo, contrasena) VALUES (?, ?)";
        $insert_stmt = $connection->prepare($insert_sql);
        $insert_stmt->bind_param("ss", $email, $hashed_password); // Usar la contraseña encriptada
        $insert_stmt->execute();

        // Verificar si el registro fue exitoso
        if ($insert_stmt->affected_rows > 0) {
            // Si el registro fue exitoso, crear una sesión
            session_start();
            $_SESSION['email'] = $email; // Guardar el correo electrónico en la sesión

            http_response_code(200);
            echo json_encode(array('message' => 'Registro exitoso', 'status' => '0'));
        } else {
            http_response_code(500);
            echo json_encode(array('message' => 'Error al registrar el usuario'));
        }

        // Cerrando la conexión 
        $insert_stmt->close();
    }

    // Cerrando la conexión 
    $check_stmt->close();
} else {
    // Si la solicitud no es POST, se envia una respuesta 405 (Método no permitido)
    http_response_code(405);
    echo json_encode(array('message' => 'Método no permitido'));
}

?>