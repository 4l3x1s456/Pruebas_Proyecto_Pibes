<?php
header('Content-Type: application/json');
require_once '../../../php/config/database.php';

$db = new Database();
$conn = $db->getConnection();

$data = json_decode(file_get_contents('php://input'), true);
$correo = $data['correo'] ?? '';
$contrasena = $data['contrasena'] ?? '';

if (empty($correo) || empty($contrasena)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Correo y contraseña son requeridos']);
    exit;
}

$stmt = $conn->prepare("SELECT id, nombre, apellido, correo, contrasena FROM usuarios WHERE correo = ? AND contrasena = ?");
$stmt->bind_param("ss", $correo, $contrasena);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo json_encode(['success' => true, 'user' => $user]);
} else {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Correo o contraseña incorrectos']);
}

$stmt->close();
$conn->close();
?>