<?php
header('Content-Type: application/json');
require_once '../../../php/config/database.php';

$db = new Database();
$conn = $db->getConnection();

$data = json_decode(file_get_contents('php://input'), true);
$contrasena = $data['contrasena'] ? ", contrasena = '" . $data['contrasena'] . "'" : "";
$stmt = $conn->prepare("UPDATE usuarios SET nombre = ?, apellido = ? $contrasena WHERE id = ? AND correo = ?");
$stmt->bind_param("sssi", $data['nombre'], $data['apellido'], $data['id'], $data['correo']);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(400);
    echo json_encode(['success' => false]);
}
$stmt->close();
$conn->close();
?>