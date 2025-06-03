<?php
require_once '../../../php/config/database.php';
header('Content-Type: application/json');

try {
    $db = new Database();
    $conn = $db->getConnection();

    $data = json_decode(file_get_contents('php://input'), true);

    if (
        empty($data['usuario_id']) ||
        empty($data['items']) ||
        !is_array($data['items'])
    ) {
        throw new Exception('Formato de datos inválido.');
    }

    // Preparar la consulta una sola vez
    $stmt = $conn->prepare("
        INSERT INTO pedidos (usuario_id, producto_id, nombre_producto, categoria_producto, cantidad)
        VALUES (?, ?, ?, ?, ?)
    ");

    if (!$stmt) {
        throw new Exception("Error al preparar la consulta: " . $conn->error);
    }

    // Recorrer los items y ejecutar la consulta
    foreach ($data['items'] as $item) {
        // Validaciones mínimas por cada item
        if (
            empty($item['producto_id']) ||
            empty($item['nombre_producto']) ||
            empty($item['categoria_producto']) ||
            empty($item['cantidad'])
        ) {
            throw new Exception("Datos del producto incompletos: " . json_encode($item));
        }

        $stmt->bind_param(
            "iissi",
            $data['usuario_id'],
            $item['producto_id'],
            $item['nombre_producto'],
            $item['categoria_producto'],
            $item['cantidad']
        );

        if (!$stmt->execute()) {
            throw new Exception("Error al insertar pedido: " . $stmt->error);
        }
    }

    $stmt->close();
    $conn->close();

    echo json_encode(['success' => true, 'message' => 'Pedidos insertados correctamente.']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
