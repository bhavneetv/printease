<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-USER-ID");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once "../../config/conn.php";

// ---------- AUTH (optional admin check) ----------
$admin_id = $_SERVER['X_USER_ID'] ?? null;
$stmt = $conn->prepare("SELECT * FROM users WHERE user_id = ? AND role = ?");
$stmt->bind_param("is", $admin_id, $role);

$role = "admin";
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows < 0) {
    return json_encode([
        "success" => false,
        "message" => "Unauthorized"
    ]);
}


// ---------- FETCH USERS ----------
$sql = "
SELECT 
    user_id AS id,
    full_name AS name,
    email,
    role,
    
    DATE(created_at) AS joined
FROM users
ORDER BY created_at DESC
";

$result = $conn->query($sql);

$users = [];

while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode([
    "success" => true,
    "users" => $users
]);
