<?php
// 1. Allow React (localhost:5173) to access this file.
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// 2. Handle the "Preflight" check
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/db_connect.php'; // Check if your config path is correct! 
// Note: In your image, 'config' is a sibling to 'api', so '../config/' might be needed depending on your db_connect location.

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id) && !empty($data->fcm_token)) {
    
    $user_id = mysqli_real_escape_string($conn, $data->user_id);
    $token = mysqli_real_escape_string($conn, $data->fcm_token);

    $query = "UPDATE users SET fcm_token = '$token' WHERE id = '$user_id'";
    
    if (mysqli_query($conn, $query)) {
        echo json_encode(["message" => "Token updated successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . mysqli_error($conn)]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
}
?>