<?php
require_once("../config/conn.php");

// For preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"] ?? "";
$token = $data["token"] ?? "";

// SECRET KEY (must match login.php key)
$secret = "MY_SECRET_KEY_123";

// Re-create token to verify user
$realToken = hash("sha256", $email . $secret);

if ($token !== $realToken) {
    echo json_encode(["status" => "error", "message" => "Invalid token"]);
    exit;
}

// DB CONNECT
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "DB connection failed"]);
    exit;
}

// GET USER ID
$u = $conn->query("SELECT id FROM users WHERE email='$email' LIMIT 1");
$user = $u->fetch_assoc();
$userId = $user["id"];

// TOTAL ORDERS
$q1 = $conn->query("SELECT COUNT(*) AS total FROM orders WHERE created_by=$userId");
$totalOrders = $q1->fetch_assoc()["total"];

// PENDING ORDERS
$q2 = $conn->query("SELECT COUNT(*) AS pending FROM orders WHERE created_by=$userId AND status='pending'");
$pending = $q2->fetch_assoc()["pending"];

// TOTAL SPENT
$q3 = $conn->query("SELECT SUM(payment_amount) AS spent FROM orders WHERE created_by=$userId AND payment_status='paid'");
$spent = $q3->fetch_assoc()["spent"] ?? 0;
    
$recent = [];
$q4 = $conn->query("SELECT id, file_name, pages, payment_amount, status 
                    FROM orders 
                    WHERE created_by=$userId 
                    ORDER BY id DESC 
                    LIMIT 6");

while ($row = $q4->fetch_assoc()) {
    $recent[] = $row;
}



$response = [
    "status" => "success",

    // CARD VALUES
    "cards" => [
        "total_orders" => $totalOrders,
        "pending_orders" => $pending,
        "total_spent" => $spent
    ],

    // LAST 6 ORDERS
    "recent_activity" => $recent,

];

echo json_encode($response, JSON_PRETTY_PRINT);
?>
