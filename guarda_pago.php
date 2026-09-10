<?php
// Permite la comunicación sin bloqueos entre tu HTML y el servidor local de XAMPP
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// 1. CONFIGURACIÓN DE TU BASE DE DATOS DEL SENA
$servidor = "localhost";
$usuario = "root";       // Usuario por defecto de XAMPP
$contrasena = "";        // Contraseña por defecto de XAMPP (vacía)
$base_datos = "salondebelleza"; // Nombre exacto que pusiste en phpMyAdmin

// Crear la conexión con MySQL
$conexion = new mysqli($servidor, $usuario, $contrasena, $base_datos);

// Verificar si la conexión falló
if ($conexion->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión: " . $conexion->connect_error]);
    exit;
}

// 2. CAPTURAR LA REFERENCIA DE WOMPI DESDE EL JAVASCRIPT
$datosRecibidos = json_decode(file_get_contents("php://input"), true);

if (!empty($datosRecibidos['referencia'])) {
    
    $referencia = $conexion->real_escape_string($datosRecibidos['referencia']);
    $pagos_agenda_id = 1; // ID por defecto para tus pruebas académicas

    // 3. INSERCIÓN EN TU TABLA 'PAGOS' (Campos de tu phpMyAdmin)
    $sql = "INSERT INTO PAGOS (Nequi, PAGOS_AGENDA_id_pagos_INT) 
            VALUES ('$referencia', $pagos_agenda_id)";

    if ($conexion->query($sql) === TRUE) {
        // Todo salió bien, le avisamos al JavaScript
        echo json_encode(["success" => true, "message" => "¡Excelente! Guardado en MySQL"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al guardar en la tabla: " . $conexion->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "No se recibieron datos del frontend"]);
}

$conexion->close();
?>