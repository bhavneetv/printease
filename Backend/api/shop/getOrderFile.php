<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once "../../config/conn.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['order_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Order ID required"
    ]);
    exit;
}

$order_id = trim($data['order_id']);

$stmt = $conn->prepare(
    "SELECT file_path FROM orders WHERE order_code = ?"
);
$stmt->bind_param("s", $order_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Order not found"
    ]);
    exit;
}

$row = $result->fetch_assoc();

$file_path = $row['file_path'];

if (!file_exists("../" . $file_path)) {
    echo json_encode([
        "success" => false,
        "message" => "File not found on server"
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "file_url" => $file_path
]);
