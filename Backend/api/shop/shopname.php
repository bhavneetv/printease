<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require_once("../../config/conn.php");

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

$userId = (int)($data['user_id'] ?? 0);
$action = $data['action'] ?? 'get'; // get | open | close

if (!$userId) {
    echo json_encode([
        "status" => false,
        "message" => "User ID missing"
    ]);
    exit;
}

/* ================= GET SHOP INFO ================= */
if ($action === "get") {

    $stmt = $conn->prepare("
        SELECT shop_name, is_active 
        FROM shops 
        WHERE user_id = ?
        LIMIT 1
    ");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res->num_rows === 0) {
        echo json_encode([
            "status" => true,
            "shop_name" => "",
            "is_open" => 0
        ]);
        exit;
    }

    $shop = $res->fetch_assoc();

    echo json_encode([
        "status" => true,
        "shop_name" => $shop['shop_name'],
        "is_open" => (int)$shop['is_active']
    ]);
    exit;
}

/* ================= UPDATE SHOP STATUS ================= */
if ($action === "open" || $action === "closed") {
    // echo $action;

    $isOpen = ($action === "open") ? 0 : 1;

    $stmt = $conn->prepare("
        UPDATE shops 
        SET is_active = ?
        WHERE user_id = ?
    ");
    $stmt->bind_param("ii", $isOpen, $userId);
    $stmt->execute();

    echo json_encode([
        "status" => true,
        "message" => $isOpen ? "Shop opened" : "Shop closed",
        "is_open" => $isOpen
    ]);
    exit;
}

/* ================= INVALID ACTION ================= */
echo json_encode([
    "status" => false,
    "message" => "Invalid action"
]);
