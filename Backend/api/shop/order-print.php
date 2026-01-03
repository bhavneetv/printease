<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once '../../config/conn.php';
// DB connection

// Read JSON input
$input = json_decode(file_get_contents("php://input"), true);
$accepted_by = $input['accepted_by'] ?? null;

if (!$accepted_by) {
    echo json_encode(["error" => "accepted_by required"]);
    exit;
}

// Fetch orders for shopkeeper
$sql = "SELECT * FROM orders WHERE accepted_by = ? ORDER BY created_at DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $accepted_by);
$stmt->execute();
$result = $stmt->get_result();

$response = [];

while ($order = $result->fetch_assoc()) {

    // Fetch customer (order owner)
    $userSql = "SELECT full_name FROM users WHERE user_id = ?";
    $userStmt = $conn->prepare($userSql);
    $userStmt->bind_param("i", $order['created_by']);
    $userStmt->execute();
    $user = $userStmt->get_result()->fetch_assoc();

    // Document info
    $fileName = $order['original_file_name'];
    $extension = strtoupper(pathinfo($fileName, PATHINFO_EXTENSION));
    $documentType = $extension . " Document";

    // Date format
    $timestamp = date("Y-m-d h:i A", strtotime($order['created_at']));

    $response[] = [
        "id" => $order['order_code'],
        "documentName" => $fileName,
        "documentType" => $documentType,
        "totalPages" => (int)$order['pages'],
        "copies" => (int)$order['copies'],
        "colorType" => $order['color_type'],
        "sidedType" => $order['print_side'],
        "amount" => (int)$order['payment_amount'],
        "paymentMethod" => $order['payment_type'],
        "paymentStatus" => ucfirst($order['payment_status']),
        "orderStatus" => ucfirst($order['status']),
        "ownerName" => $user['full_name'] ?? "Unknown",
        "specialNotes" => $order['instructions'] ?? "",
        "timestamp" => $timestamp
    ];

    $userStmt->close();
}

$stmt->close();
$conn->close();

echo json_encode($response, JSON_PRETTY_PRINT);
