<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    $database = new Database();
    $db = $database->getConnection();
    if (!$db) {
        throw new Exception("No se pudo establecer la conexión a la base de datos");
    }

    $query = "SELECT id, nombre, descripcion, categoria, subcategoria, precio, stock FROM productos";
    $result = $db->query($query);

    $productos = array();
    $productos["productos"] = array();

    while ($row = $result->fetch_assoc()) {
        $id = $row['id'];
        $formatos = ['jpg', 'jpeg', 'png', 'webp'];
        $imagen = "default.jpg";

        foreach ($formatos as $formato) {
            // Fix the path by going up three levels from current PHP file location
            $ruta_imagen = dirname(__FILE__) . "/../../../assets/images/producto_" . $id . "." . $formato;
            if (file_exists($ruta_imagen)) {
                $imagen = "producto_" . $id . "." . $formato;
                break;
            }
        }

        $producto_item = array(
            "id" => $id,
            "nombre" => $row['nombre'],
            "descripcion" => $row['descripcion'],
            "categoria" => $row['categoria'],
            "subcategoria" => $row['subcategoria'],
            "precio" => $row['precio'],
            "stock" => $row['stock'],
            "imagen" => $imagen
        );

        array_push($productos["productos"], $producto_item);
    }

    http_response_code(200);
    echo json_encode($productos);
} catch (Exception $exception) {
    http_response_code(500);
    echo json_encode(array("mensaje" => "Error al obtener productos: " . $exception->getMessage()));
}
?>