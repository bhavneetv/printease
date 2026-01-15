<?php
header("Content-Type: application/json");
include "../config/conn.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id   = $data['user_id'] ?? null;
$fcm_token = $data['fcm_token'] ?? null;

if (!$user_id || !$fcm_token) {
    echo json_encode([
        "status" => false,
        "message" => "user_id and fcm_token are required"
    ]);
    exit;
}


$sql = "INSERT INTO users_fcm_tokens (user_id, fcm_token)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE fcm_token = VALUES(fcm_token), updated_at = NOW()";

$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $user_id, $fcm_token);

if ($stmt->execute()) {
    echo json_encode([
        "status" => true,
        "message" => "FCM token saved successfully"
    ]);
} else {
    echo json_encode([
        "status" => false,
        "message" => "Failed to save token"
    ]);
}

$stmt->close();
$conn->close();
?>
