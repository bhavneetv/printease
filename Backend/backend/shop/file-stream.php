<?php
require_once "../../config/conn.php";

if (!isset($_GET['order_id'])) {
    http_response_code(400);
    exit("Order ID required");
}

$order_id = trim($_GET['order_id']);
$mode = $_GET['mode'] ?? 'inline'; 

$stmt = $conn->prepare(
    "SELECT file_path, original_file_name 
     FROM orders 
     WHERE order_code = ?"
);
$stmt->bind_param("s", $order_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    exit("File not found or deleted");
}

$file = $result->fetch_assoc();
$filePath = "../" . $file['file_path'];

if (!file_exists($filePath)) {
    http_response_code(404);
    exit("File missing or deleted");
}

$mimeType = mime_content_type($filePath);
$fileName = $file['original_file_name'] ?? basename($filePath);

// 🔑 HEADERS
header("Content-Type: $mimeType");
header("Content-Length: " . filesize($filePath));
header("Accept-Ranges: bytes");

// 🔥 KEY FIX HERE
if ($mode === 'download') {
    header('Content-Disposition: attachment; filename="' . $fileName . '"');
} else {
    header('Content-Disposition: inline; filename="' . $fileName . '"');
}

readfile($filePath);
exit;
