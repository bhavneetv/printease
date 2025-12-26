<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");


require_once "../../config/conn.php";
$data = json_decode(file_get_contents("php://input"), true);
$userId = $data['user_id'] ?? 0;

if (!$userId) {
    echo json_encode(["status"=>false,"message"=>"User ID missing"]);
    exit;
}

/* ================= DASHBOARD CARDS ================= */

// TOTAL ORDERS
$totalOrders = $conn->query("
    SELECT COUNT(*) AS total 
    FROM orders 
    WHERE accepted_by = $userId
")->fetch_assoc()['total'];

// PENDING (PLACED)
$pendingOrders = $conn->query("
    SELECT COUNT(*) AS total 
    FROM orders 
    WHERE accepted_by = $userId AND status = 'placed'
")->fetch_assoc()['total'];

// PRINTING
$printingOrders = $conn->query("
    SELECT COUNT(*) AS total 
    FROM orders 
    WHERE accepted_by = $userId AND status = 'printing'
")->fetch_assoc()['total'];

// COMPLETED
$completedOrders = $conn->query("
    SELECT COUNT(*) AS total 
    FROM orders 
    WHERE accepted_by = $userId AND status = 'completed'
")->fetch_assoc()['total'];

// TODAY ORDERS
$todayOrders = $conn->query("
    SELECT COUNT(*) AS total 
    FROM orders 
    WHERE accepted_by = $userId 
    AND DATE(created_at) = CURDATE()
")->fetch_assoc()['total'];

// TODAY EARNINGS
$todayEarnings = $conn->query("
    SELECT IFNULL(SUM(payment_amount),0) AS total 
    FROM orders 
    WHERE accepted_by = $userId 
    AND DATE(created_at) = CURDATE()
    AND payment_status = 'paid'
")->fetch_assoc()['total'];

/* ================= RECENT 8 ORDERS ================= */

$recentOrders = [];

$sql = "
SELECT 
    o.order_id,
    o.original_file_name,
    o.pages,
    o.payment_amount,
    o.payment_type,
    o.payment_status,
    o.status,
    u.full_name AS customer_name
FROM orders o
JOIN users u ON o.created_by = u.user_id
WHERE o.accepted_by = ?
ORDER BY o.created_at DESC
LIMIT 8
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$res = $stmt->get_result();

while ($row = $res->fetch_assoc()) {
    $recentOrders[] = $row;
}

/* ================= FINAL RESPONSE ================= */

echo json_encode([
    "status" => true,
    "cards" => [
        "total_orders"     => (int)$totalOrders,
        "pending_orders"   => (int)$pendingOrders,
        "printing_orders"  => (int)$printingOrders,
        "completed_orders" => (int)$completedOrders,
        "today_orders"     => (int)$todayOrders,
        "today_earnings"   => (float)$todayEarnings
    ],
    "recent_orders" => $recentOrders
]);
