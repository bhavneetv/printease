<?php
header("Content-Type: application/json");
include "../config/conn.php";

$user_id = $_POST['user_id'] ?? null;

if(!$user_id){
    echo json_encode([
        "status" => "error",
        "message" => "user_id is required"
    ]);
    exit;
}

// --------------------
// 1. GET USER PROFILE
// --------------------
$sql = "SELECT user_id, full_name, email, phone, address ,created_at
        FROM users 
        WHERE user_id = '$user_id' 
        LIMIT 1";

$result = mysqli_query($conn, $sql);

if(mysqli_num_rows($result) == 0){
    echo json_encode([
        "status" => "error",
        "message" => "User not found"
    ]);
    exit;
}

$user = mysqli_fetch_assoc($result);

// Profile Image URL
$profileImage = "https://ui-avatars.com/api/?name=" . urlencode($user["full_name"]) . "&background=667eea&color=fff&bold=true&size=120";

// ------------------------------
// 2. GET TOTAL ORDERS + SPENDING
// ------------------------------
$orderQuery = "
    SELECT 
        COUNT(*) AS total_orders,
        COALESCE(SUM(payment_amount), 0) AS total_spent
    FROM orders
    WHERE created_by = '$user_id'
";

$orderResult = mysqli_query($conn, $orderQuery);
$order = mysqli_fetch_assoc($orderResult);

// ------------------------------
// 3. FINAL JSON OUTPUT
// ------------------------------
echo json_encode([
    "status" => "success",
    "data" => [
        "fullName"     => $user["full_name"],
        "email"        => $user["email"],
        "phone"        => $user["phone"] ?? "",
        "address"      => $user["address"] ?? "",
        "paymentMode"  => $user["payment_mode"] ?? "",
        "upiId"        => $user["upi_id"] ?? "",
        "profileImage" => $profileImage,
        "totalOrders"  => (int)$order["total_orders"],
        "totalSpent"   => (float)$order["total_spent"],
        "crea"         => date("M Y", strtotime($user["created_at"]))
    ]
]);
?>
