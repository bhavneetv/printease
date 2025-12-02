<?php
header("Content-Type: application/json");
include "../config/conn.php";

if (!isset($_FILES['file'])) {
    echo json_encode(["success" => false, "message" => "No file uploaded"]);
    exit;
}

$user_id       = $_POST['user_id'];
$shop_id       = $_POST['shop_id'];
$payment_type  = $_POST['payment_type'];

$total_pages   = $_POST['total_pages'];
$copies        = $_POST['copies'];
$final_pages   = $_POST['final_pages'];
$color_mode    = $_POST['color_mode'];
$print_side    = $_POST['print_side'];
$paper_size    = $_POST['paper_size'];

$rate_per_page = $_POST['rate_per_page'];
$total_amount  = $_POST['total_amount'];


// -------------------------
// FILE UPLOAD
// -------------------------
$uploadDir = "../uploads/orders/";

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$originalName = $_FILES["file"]["name"];
$ext = pathinfo($originalName, PATHINFO_EXTENSION);

// unique name
$storedName = uniqid("file_", true) . "." . $ext;
$filePath = $uploadDir . $storedName;

if (!move_uploaded_file($_FILES["file"]["tmp_name"], $filePath)) {
    echo json_encode(["success" => false, "message" => "Error saving file"]);
    exit;
}

$fileSize = $_FILES["file"]["size"];

// -------------------------
// INSERT INTO DATABASE
// -------------------------
$sql = "INSERT INTO orders (
    created_by, accepted_by_id,
    original_file_name, stored_file_name, file_path, 
    pages, copies,
    color_mode, print_side, paper_size,
    rate_per_page, total_amount,
    payment_type, payment_status, order_status
) VALUES (
    '$user_id', '$shop_id',
    '$originalName', '$storedName', '$filePath',
    '$total_pages', '$copies', 
    '$color_mode', '$print_side', '$paper_size',
    '$rate_per_page', '$total_amount',
    '$payment_type', 'pending', 'placed'
)";

if (mysqli_query($conn, $sql)) {
    echo json_encode([
        "success" => true,
        "order_id" => mysqli_insert_id($conn)
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);
}
