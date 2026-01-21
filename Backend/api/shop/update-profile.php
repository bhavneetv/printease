<?php
// ---------------- CORS ----------------
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-USER-ID");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once "../../config/conn.php";

$user_id = $_SERVER['HTTP_X_USER_ID'] ?? null;

if (!$user_id || !is_numeric($user_id)) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized"
    ]);
    exit;
}

$user_id = (int)$user_id;

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON"
    ]);
    exit;
}

$conn->begin_transaction();

try {

    $userSql = "
        UPDATE users SET
            full_name = ?,
            email = ?,
            phone = ?
        WHERE user_id = ?
    ";

    $userStmt = $conn->prepare($userSql);
    $userStmt->bind_param(
        "sssi",
        $data['owner_name'],
        $data['email'],
        $data['contact_number'],
        $user_id
    );
    $userStmt->execute();

    $shopSql = "
        UPDATE shops SET
            shop_name = ?,
            address = ?,
            latitude = ?,
            longitude = ?,
            image_url = ?,
            rate_bw = ?,
            rate_color = ?,
            upi_id = ?,
            cod = ?
        WHERE user_id = ?
    ";

    $shopStmt = $conn->prepare($shopSql);
    $shopStmt->bind_param(
        "ssiisiisii",
        $data['shop_name'],
        $data['address'],
        $data['latitude'],
        $data['longitude'],
        $data['shop_image'],
        $data['bw_price'],
        $data['color_price'],
        $data['upi_id'],
        $data['accept_cash'],
        $user_id
    );
    $shopStmt->execute();

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Profile updated successfully"
    ]);

} catch (Exception $e) {
    $conn->rollback();

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Update failed",
        "error" => $e->getMessage()
    ]);
}
