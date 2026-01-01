<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

// DB connection
require_once "../../config/conn.php";
// Get accepted_by (current logged-in shopkeeper)
// $accepted_by = $_POST['accepted_by'] ?? null;
$input = json_decode(file_get_contents("php://input"), true);
$accepted_by = $input['accepted_by'] ?? null;


// echo $accepted_by;
if (!$accepted_by) {
    echo json_encode(["error" => "accepted_by is rsequired"]);
    exit;
}

// Fetch orders accepted by this shopkeeper
$sql = "SELECT * FROM orders WHERE accepted_by = ? ORDER BY created_at DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $accepted_by);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];

while ($order = $result->fetch_assoc()) {

    // Get customer info
    $userSql = "SELECT full_name, phone FROM users WHERE user_id = ?";
    $userStmt = $conn->prepare($userSql);
    $userStmt->bind_param("i", $order['created_by']);
    $userStmt->execute();
    $userResult = $userStmt->get_result();
    $user = $userResult->fetch_assoc();

    // File name & type
    $documentName = $order['original_file_name'];
    $extension = strtoupper(pathinfo($documentName, PATHINFO_EXTENSION));

    // Date format convert
    $createdDate = date("Y-m-d h:i A", strtotime($order['created_at']));

    $orders[] = [

        "order_id" => $order['order_code'],
        "document_name" => $documentName,
        "document_type" => $extension,
        "customer_name" => $user['full_name'] ?? "Unknown",
        "customer_phone" => $user['phone'] ?? "",
        "pages" => (int)$order['pages'],
        "copies" => (int)$order['copies'],
        "color_type" => $order['color_type'],
        "print_side" => $order['print_side'],
        "payment_method" => $order['payment_type'],
        "payment_status" => $order['payment_status'],
        "status" => $order['status'],
        "amount" => (int)$order['payment_amount'],
        "created_date" => $createdDate,
        "instructions" => $order['instructions'] ?? "",
    ];

    $userStmt->close();
}

$orders = [
    "success" => true,
    "orders" => $orders,
];
$stmt->close();
$conn->close();

echo json_encode($orders, JSON_PRETTY_PRINT);
