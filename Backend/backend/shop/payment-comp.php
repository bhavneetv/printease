<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once "../../config/conn.php";
require_once __DIR__ . "/../../notification/firebase-helper.php";

$data = json_decode(file_get_contents("php://input"), true);


if (!isset($data['order_id']) || !isset($data['action'])) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);
    exit;
}

$order_id = trim($data['order_id']);


$action   = strtolower(trim($data['action']));
$payment_type = isset($data['payment_type'])
    ? strtolower(trim($data['payment_type']))
    : null;

// 🔍 Fetch order
$check = $conn->prepare(
    "SELECT payment_status, status ,created_by
     FROM orders 
     WHERE order_code = ?"
);
$check->bind_param("s", $order_id);
$check->execute();
$result = $check->get_result();
// $row = $result->fetch_assoc();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Order not found"
    ]);
    exit;
}

$order = $result->fetch_assoc();
$created_by = $order['created_by'];

if ($action === "pay") {

    if (!$payment_type || !in_array($payment_type, ['cash', 'upi'])) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid or missing payment type"
        ]);
        exit;
    }

    if ($order['payment_status'] === 'paid') {
        echo json_encode([
            "success" => false,
            "message" => "Payment already completed"
        ]);
        exit;
    }

    $update = $conn->prepare(
        "UPDATE orders 
         SET payment_status = 'paid',
             payment_type = ?
         WHERE order_code = ?"
    );
    $update->bind_param("ss", $payment_type, $order_id);

    if ($update->execute()) {
        sendFCMNotification(
            $created_by,
            "Payment Completed",
            "Your payment has been completed successfully"
        );
        echo json_encode([
            "success" => true,
            "message" => "Payment marked as completed"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Payment update failed"
        ]);
    }

    exit;
}

if ($action === "print") {

    if ($order['payment_status'] !== 'paid') {
        echo json_encode([
            "success" => false,
            "message" => "Payment not completed yet"
        ]);
        exit;
    }

    if ($order['status'] === 'printing') {

        echo json_encode([
            "success" => false,
            "message" => "Order already printing"
        ]);
        exit;
    }

    $update = $conn->prepare(
        "UPDATE orders 
         SET status = 'printing'
         WHERE order_code = ?"
    );
    $update->bind_param("s", $order_id);

    if ($update->execute()) {
        sendFCMNotification(
            $created_by,
            "Order Printing",
            "Your order is now being printed"
        );
        echo json_encode([
            "success" => true,
            "message" => "Order status changed to printing"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Failed to update print status"
        ]);
    }

    exit;
}


echo json_encode([
    "success" => false,
    "message" => "Invalid action"
]);
