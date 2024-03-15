<?php
require_once('../config/connection.php');

// Consulta SQL
$sql = "SELECT * FROM usuarios";

// Ejecutar la consulta
$result = $connection->query($sql);

// Verificar si la consulta fue exitosa
if ($result) {
    while ($row = $result->fetch_assoc()) {
        // Hacer algo con cada fila de resultados
        echo 'Nombre: ' . $row['nombre'] . '<br>';
    }
} else {
    echo 'Error en la consulta: ' . $connection->error;
}

// Cerrar la conexión
$connection->close();
?>
