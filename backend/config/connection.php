<?php
// Datos de conexión a la base de datos
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'pokeapi';

// Conexión a la base de datos
$connection = new mysqli($host, $user, $password, $database);

// Verificar la conexión
if ($connection->connect_error) {
    die('Error de conexión: ' . $connection->connect_error);
}

// Establecer el conjunto de caracteres a UTF-8
$connection->set_charset('utf8');
?>
