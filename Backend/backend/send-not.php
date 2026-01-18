<?php
header("Content-Type: application/json");
require_once "../config/conn.php";


$input = json_decode(file_get_contents("php://input"), true);
$user_id = isset($input['user_id']) ? (int)$input['user_id'] : 0;

if ($user_id <= 0) {
    echo json_encode([
        "status" => 0,
        "message" => "Invalid user_id"
    ]);
    exit;
}


$stmt = $conn->prepare(
    "SELECT 1 FROM users_fcm_tokens WHERE user_id = ? LIMIT 1"
);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->store_result();


if ($stmt->num_rows > 0) {
    echo json_encode([
        "status" => 1
    ]);
} else {
    echo json_encode([
        "status" => 0
    ]);
}

$stmt->close();
$conn->close();
