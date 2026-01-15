<?php
header("Content-Type: application/json");
include "../config/conn.php";
include "../notification/firebase-helper.php";

if (!isset($_FILES['file'])) {
    echo json_encode(["success" => false, "message" => "No file uploaded"]);
    exit;
}

$user_id       = $_POST['user_id'];
$shop_id       = $_POST['shop_id'];
$payment_type  = $_POST['payment_type'];
$orderCode  =    $_POST['order_id'];

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


// function generate_random_number() {
//     $prefix = "ORD-";
//     $digits = substr(str_shuffle("0123456789"), 0, 4);
//     return $prefix . $digits;
// }

// $orderCode = generate_random_number();

$sql  = "SELECT cod FROM shops WHERE shop_id = '$shop_id'";
$res  = mysqli_query($conn, $sql);
$row  = mysqli_fetch_assoc($res);
$cod  = $row['cod'];

if ($cod == 1 && $payment_type == "cash") {
    // Cash on Delivery is allowed
} elseif ($cod == 0 && $payment_type == "cash") {
    echo json_encode([
        "success" => false,
        "message" => "Cash on Delivery is not available for this shop. Please choose UPI payment."
    ]);
    exit;
}


// -------------------------
// INSERT INTO DATABASE
// -------------------------
$sql = "INSERT INTO orders (
    created_by, accepted_by,
    original_file_name, stored_file_name, file_path, 
    pages, copies,
    color_type, print_side, page_type,
    payment_amount,
    payment_type, payment_status, status , order_code
) VALUES (
    '$user_id', '$shop_id',
    '$originalName', '$storedName', '$filePath',
    '$total_pages', '$copies', 
    '$color_mode', '$print_side', '$paper_size', '$total_amount',
    '$payment_type', 'pending', 'placed' , '$orderCode'
)";

if (mysqli_query($conn, $sql)) {
    sendFCMNotification(
        $shop_id,
        "shop",
        "New Order Received",
        "You have received a new order of $total_pages pages with $copies copies"
    );

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
