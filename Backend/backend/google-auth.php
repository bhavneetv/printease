<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
include '../config/conn.php';
$data = json_decode(file_get_contents("php://input"), true);
$token = $data['token'] ?? '';

if (!$token) {
    echo json_encode(["status"=>false,"message"=>"Token missing"]);
    exit;
}

/* ===== VERIFY GOOGLE TOKEN ===== */
$verifyUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" . urlencode($token);
$response  = json_decode(file_get_contents($verifyUrl), true);

if (!isset($response['email'])) {
    echo json_encode(["status"=>false,"message"=>"Invalid Google token"]);
    exit;
}

$email   = $response['email'];
$name    = $response['name'] ?? 'Google User';
// $picture = $response['picture'] ?? null;
$role    = 'user';

/* ===== CHECK USER ===== */
$stmt = $conn->prepare("SELECT user_id, role FROM users WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    // SIGNUP
    $stmt = $conn->prepare(
        "INSERT INTO users (full_name,email,role )
         VALUES (?,?,?)"
    );
    $stmt->bind_param("sss", $name, $email, $role );
    $stmt->execute();
    $userId = $conn->insert_id;
} else {
    // LOGIN
    $user = $res->fetch_assoc();
    $userId = $user['user_id'];
    $role   = $user['role'];
}

/* ===== RETURN TO FRONTEND ===== */
echo json_encode([
    "status" => true,
    "message" => "Google login successful",
    "data" => [
        "id" => $userId,
        "name" => $name,
        "email" => $email,
        "role" => $role,
        // "profile_image" => $picture
    ]
]);
