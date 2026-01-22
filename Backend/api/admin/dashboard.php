<?php

header("Access-Control-Allow-Origin: http://localhost:5173"); // Vite dev URL
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-USER-ID");
header("Access-Control-Allow-Credentials: true");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

require_once "../../config/conn.php";


$admin_id = $_SERVER['HTTP_X_USER_ID'] ?? null;

if (!$admin_id) {
  echo json_encode(["success" => false, "message" => "Admin ID missing"]);
  exit;
}

$adminCheck = $conn->prepare(
  "SELECT user_id FROM users WHERE user_id = ? AND role = 'admin'"
);
$adminCheck->bind_param("i", $admin_id);
$adminCheck->execute();

if ($adminCheck->get_result()->num_rows === 0) {
  echo json_encode(["success" => false, "message" => "Unauthorized"]);
  exit;
}

/* ===============================
   USERS (generateMockUsers)
================================ */
$users = [];
$userQuery = "
SELECT 
  u.user_id AS id,
  u.full_name AS name,
  u.email,
  u.role,
 
  DATE_FORMAT(u.created_at, '%d/%m/%Y') AS joined,
  COUNT(o.order_id) AS orders
FROM users u
LEFT JOIN orders o ON o.created_by = u.user_id
GROUP BY u.user_id
ORDER BY u.created_at DESC
";

$userResult = $conn->query($userQuery);
while ($row = $userResult->fetch_assoc()) {
  $users[] = $row;
}


$shops = [];
$shopQuery = "
SELECT
  s.shop_id AS id,
  s.shop_name AS name,
  u.full_name AS owner,
  u.email,
  u.address,
  CASE
    WHEN s.is_active = 1 THEN 'Active'
    ELSE 'Inactive'
  END AS status,
  DATE_FORMAT(s.created_at, '%d/%m/%Y') AS registered,
  COUNT(o.order_id) AS totalOrders,
  IFNULL(SUM(o.payment_amount), 0) AS revenue
FROM shops s
JOIN users u ON u.user_id = s.user_id
LEFT JOIN orders o ON o.accepted_by = s.shop_id
GROUP BY s.shop_id
ORDER BY s.created_at DESC
";

$shopResult = $conn->query($shopQuery);
while ($row = $shopResult->fetch_assoc()) {
  $shops[] = $row;
}

$orders = [];
$orderQuery = "
SELECT
  o.order_id AS id,
  u.full_name AS customer,
  s.shop_name AS shop,
  COUNT(oi.order_id) AS items,
  o.payment_amount AS amount,
  o.status,
  DATE_FORMAT(o.created_at, '%d/%m/%Y') AS date,
  o.payment_type AS paymentMethod
FROM orders o
JOIN users u ON u.user_id = o.created_by
JOIN shops s ON s.shop_id = o.accepted_by
LEFT JOIN orders oi ON oi.order_id = o.order_id
GROUP BY o.order_id
ORDER BY o.created_at DESC
";

$orderResult = $conn->query($orderQuery);
while ($row = $orderResult->fetch_assoc()) {
  $orders[] = $row;
}

echo json_encode([
  "success" => true,
  "users" => $users,
  "shops" => $shops,
  "orders" => $orders
]);
