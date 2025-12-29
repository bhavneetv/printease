<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

require_once("../config/conn.php");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    echo json_encode(["status" => false, "message" => "Invalid request"]);
    exit;
}


$data = json_decode(file_get_contents("php://input"), true);
$userId = (int)($data['user_id'] ?? 0);

if (!$userId) {
    echo json_encode(["status" => false, "message" => "User ID missing"]);
    exit;
}

/* ================= TRANSACTION ================= */
$conn->begin_transaction();

try {

    // Delete user orders
    $stmt = $conn->prepare("DELETE FROM orders WHERE created_by = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();

    // Delete shop (if shopkeeper)
    $stmt = $conn->prepare("DELETE FROM shops WHERE user_id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();

    // Delete user account
    $stmt = $conn->prepare("DELETE FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();

    $conn->commit();

    echo json_encode([
        "status" => true,
        "message" => "Account deleted successfully"
    ]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode([
        "status" => false,
        "message" => "Failed to delete account"
    ]);
}
