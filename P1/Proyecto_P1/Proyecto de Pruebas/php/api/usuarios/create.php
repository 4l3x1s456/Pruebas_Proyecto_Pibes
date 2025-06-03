<?php
header('Content-Type: application/json');
require_once '../../../php/config/database.php';

$db = new Database();
$conn = $db->getConnection();

$data = json_decode(file_get_contents('php://input'), true);
$stmt = $conn->prepare("INSERT INTO usuarios (nombre, apellido, correo, contrasena) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $data['nombre'], $data['apellido'], $data['correo'], $data['contrasena']);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Correo ya registrado']);
}
$stmt->close();
$conn->close();
?>