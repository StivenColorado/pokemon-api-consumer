<?php

// Permitir solicitudes CORS desde cualquier origen
header("Access-Control-Allow-Origin: *");
// Permitir métodos de solicitud específicos (POST en este caso)
header("Access-Control-Allow-Methods: POST");
// Permitir ciertos encabezados en la solicitud
header("Access-Control-Allow-Headers: Content-Type");

// Si la solicitud es OPTIONS, enviar una respuesta exitosa
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Incluir el archivo de conexión a la base de datos
require_once('../config/connection.php');

// Verificar si se recibieron datos mediante POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener los datos del formulario en formato JSON
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data);

    // Validar los datos (aquí puedes agregar tu lógica de validación)
    $email = $data->email;
    $password = $data->password;

    // Consulta SQL para validar el usuario
    $sql = "SELECT * FROM usuarios WHERE correo = ?";
    
    // Preparar la consulta
    $stmt = $connection->prepare($sql);
    
    // Vincular parámetros
    $stmt->bind_param("s", $email);
    
    // Ejecutar la consulta
    $stmt->execute();
    
    // Obtener el resultado de la consulta
    $result = $stmt->get_result();
    
    // Verificar si se encontraron resultados
    if ($result->num_rows > 0) {
        // Obtener la fila de resultados
        $row = $result->fetch_assoc();
        // Obtener la contraseña almacenada en la base de datos
        $stored_password = $row['contrasena'];
        // Verificar si la contraseña proporcionada coincide con la almacenada
        if (password_verify($password, $stored_password)) {
            // Si se encontró un usuario con las credenciales proporcionadas, crear una sesión
            $_SESSION['email'] = $email; // Guardar el nombre de usuario en la sesión
            session_start();
            // Enviar una respuesta exitosa con el mensaje
            http_response_code(200);
            echo json_encode(array('message' => 'Autenticación exitosa', 'status' => 'success'));
        } else {
            // Si la contraseña no coincide, enviar una respuesta de error con el mensaje
            http_response_code(401);
            echo json_encode(array('message' => 'Credenciales incorrectas', 'status' => 'incorrect'));
        }
    } else {
        // Si no se encontró un usuario con el correo proporcionado, enviar una respuesta de error con el mensaje
        http_response_code(401);
        echo json_encode(array('message' => 'Credenciales incorrectas', 'status' => 'error'));
    }

    // Cerrar la conexión y liberar recursos
    $stmt->close();
} else {
    // Si la solicitud no es POST, enviar una respuesta 405 (Método no permitido) con el mensaje
    http_response_code(405);
    echo json_encode(array('message' => 'Método no permitido', 'status' => 'error'));
}

?>
