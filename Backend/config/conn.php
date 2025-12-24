<?php

// ================== CORS ==================
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

$allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:8080",
];

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// ================== DB ==================
$host = "localhost";
$user = "root";
$pass = "";
$db   = "printease";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "DB connection failed"
    ]);
    exit;
}

$conn->set_charset("utf8mb4");