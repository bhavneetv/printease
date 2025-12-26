<?php
require_once("../config/conn.php");

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);
$userId = (int)($data["user_id"] ?? 0);

if (!$userId) {
    echo json_encode([
        "status" => "success",
        "cards" => [
            "total_orders" => 0,
            "pending_orders" => 0,
            "total_spent" => 0
        ],
        "recent_activity" => []
    ]);
    exit;
}

/* ================= TOTAL ORDERS ================= */
$q1 = $conn->query("
    SELECT COUNT(*) AS total 
    FROM orders 
    WHERE created_by = $userId
");
$totalOrders = ($q1 && $row = $q1->fetch_assoc()) ? (int)$row['total'] : 0;

/* ================= PENDING ORDERS ================= */
$q2 = $conn->query("
    SELECT COUNT(*) AS pending 
    FROM orders 
    WHERE created_by = $userId AND status = 'placed'
");
$pending = ($q2 && $row = $q2->fetch_assoc()) ? (int)$row['pending'] : 0;

/* ================= TOTAL SPENT ================= */
$q3 = $conn->query("
    SELECT IFNULL(SUM(payment_amount),0) AS spent 
    FROM orders 
    WHERE created_by = $userId AND payment_status = 'paid'
");
$spent = ($q3 && $row = $q3->fetch_assoc()) ? (float)$row['spent'] : 0;

$q33 = $conn->query("
    SELECT IFNULL(SUM(pages),0) AS pages 
    FROM orders 
    WHERE created_by = $userId 
");
$pages = ($q33 && $row = $q33->fetch_assoc()) ? (float)$row['pages'] : 0;

/* ================= RECENT ORDERS ================= */
$recent = [];
$q4 = $conn->query("
    SELECT order_code, original_file_name, pages, payment_amount, status 
    FROM orders 
    WHERE created_by = $userId 
    ORDER BY order_id DESC 
    LIMIT 6
");

if ($q4 && $q4->num_rows > 0) {
    while ($row = $q4->fetch_assoc()) {
        $recent[] = $row;
    }
}

/* ================= FINAL RESPONSE ================= */
echo json_encode([
    "status" => "success",
    "cards" => [
        "pages" => $pages,
        "total_orders" => $totalOrders,
        "pending_orders" => $pending,
        "total_spent" => $spent
    ],
    "recent_activity" => $recent
], JSON_PRETTY_PRINT);
