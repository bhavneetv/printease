<?php
header("Content-Type: application/json");
require_once "../config/conn.php";

$user_id = $_POST['user_id'] ?? null;
echo $user_id;



$stmt = $conn->prepare(
    "SELECT * FROM users_fcm_tokens WHERE user_id = ? LIMIT 1"
);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode($user_id);
} else {
    echo json_encode($user_id);
}


// echo json_encode($stmt->num_rows > 0 );
// print_r($stmt->num_rows);

$stmt->close();
$conn->close();
