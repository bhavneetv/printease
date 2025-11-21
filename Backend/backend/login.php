<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once('../config/conn.php');

$q = $conn->query("SELECT * FROM users WHERE id = 1 LIMIT 1");
$user = $q->fetch_assoc();

$secret = "MY_SECRET_KEY_123";
$token = hash("sha256", $user["email"] . $secret);

echo json_encode([
    "status" => "success",
    "user" => [
        "id" => ($user["id"]),
        "email" => $user["email"],
        "name" => $user["full_name"]
    ],
    "token" => $token
]);
?>
