<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: Content-Type");
// header("Access-Control-Allow-Methods: PUT, OPTIONS");

require_once("../config/conn.php");

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Only allow PUT
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    echo json_encode(["status" => false, "message" => "Invalid request method"]);
    exit;
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

$userId = (int)($data['user_id'] ?? 0);
$name   = trim($data['full_name'] ?? '');
$phone  = trim($data['phone'] ?? '');
$address = trim($data['address'] ?? '');
// $profileImage = trim($data['profile_image'] ?? '');

if (!$userId) {
    echo json_encode(["status" => false, "message" => "User ID missing"]);
    exit;
}

// Build dynamic update (only update provided fields)
$fields = [];
$params = [];
$types  = "";

if ($name !== "") {
    $fields[] = "full_name = ?";
    $params[] = $name;
    $types   .= "s";
}
if ($phone !== "") {
    $fields[] = "phone = ?";
    $params[] = $phone;
    $types   .= "s";
}
if ($address !== "") {
    $fields[] = "address = ?";
    $params[] = $address;
    $types   .= "s";
}


if (empty($fields)) {
    echo json_encode(["status" => false, "message" => "No data to update"]);
    exit;
}

// Add user id
$params[] = $userId;
$types   .= "i";

$sql = "
    UPDATE users 
    SET " . implode(", ", $fields) . "
    WHERE user_id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();

echo json_encode([
    "status" => true,
    "message" => "Profile updated successfully"
]);
