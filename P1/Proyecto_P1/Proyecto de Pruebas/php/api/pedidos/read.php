<?php
header('Content-Type: application/json');
require_once '../../../php/config/database.php';

$db = new Database();
$conn = $db->getConnection();

$user_id = $_GET['user_id'] ?? 0;
$stmt = $conn->prepare("SELECT * FROM pedidos WHERE usuario_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$pedidos = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode(['pedidos' => $pedidos]);
$stmt->close();
$conn->close();
?>