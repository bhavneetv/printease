<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// DB connection
require_once "../config/conn.php";  // your db connection file

$response = [];

// Read JSON input
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input["user_id"])) {
    echo json_encode(["error" => "user_id missing"]);
    exit;
}

$user_id = intval($input["user_id"]);

// Query to get user orders + shop name
$sql = "SELECT 
            o.order_id,
            o.order_code,
            o.payment_amount,
            o.created_at,
            o.status,
            s.shop_name,
            s.rate_bw,
            s.rate_color,
            o.original_file_name,
            o.pages,
            o.copies,
            o.payment_status,
            o.payment_type
        FROM orders o
        JOIN shops s ON o.accepted_by = s.shop_id
        WHERE o.created_by = ?
        ORDER BY o.order_id DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];

while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

echo json_encode([
    "success" => true,
    "orders" => $orders
]);

$stmt->close();
$conn->close();
?>