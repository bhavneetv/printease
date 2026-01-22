<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-USER-ID");
header("Content-Type: application/json");
require_once "../../config/conn.php"; // adjust path if needed

// Admin ID from header
// $admin_id = $_SERVER['HTTP_X_USER_ID'] ?? null;

// Request body
$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? null;
$new_role = $data['role'] ?? null;
$admin_id = $data['admin_id'] ?? null;
// echo $admin_id;
// echo $user_id;
// echo $new_role;

function generateRandomCode($length = 6)
{
  // Validate length
  if ($length < 6 || $length > 7) {
    $length = 6; // Default to 6 if invalid
  }

  // Characters to use (uppercase letters, lowercase letters, and numbers)
  $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  $code = '';
  $charactersLength = strlen($characters);

  for ($i = 0; $i < $length; $i++) {
    $code .= $characters[random_int(0, $charactersLength - 1)];
  }

  return $code;
}
// Basic validation
if (!$admin_id || !$user_id || !$new_role || !$data['admin_id']) {
  echo json_encode([
    "success" => false,
    "message" => "Invalid request data"
  ]);
  exit;
}

/* ===========================
   1️⃣ Verify admin
=========================== */
$adminCheck = $conn->prepare(
  "SELECT user_id FROM users WHERE user_id = ? AND role = 'admin'"
);
$adminCheck->bind_param("i", $admin_id);
$adminCheck->execute();

if ($adminCheck->get_result()->num_rows === 0) {
  echo json_encode([
    "success" => false,
    "message" => "Unauthorized"
  ]);
  exit;
}

/* ===========================
   2️⃣ Update user role
=========================== */
$updateRole = $conn->prepare(
  "UPDATE users SET role = ? WHERE user_id = ?"
);
$updateRole->bind_param("si", $new_role, $user_id);

if (!$updateRole->execute()) {
  echo json_encode([
    "success" => false,
    "message" => "Failed to update role"
  ]);
  exit;
}

/* ===========================
   3️⃣ If role = shopkeeper → insert into shops
=========================== */
if ($new_role === "shopkeeper") {

  // Fetch user details
  $userStmt = $conn->prepare(
    "SELECT full_name, address FROM users WHERE user_id = ?"
  );
  $userStmt->bind_param("i", $user_id);
  $userStmt->execute();
  $user = $userStmt->get_result()->fetch_assoc();

  if (!$user) {
    echo json_encode([
      "success" => false,
      "message" => "User not found"
    ]);
    exit;
  }

  // Check if shop already exists
  $shopCheck = $conn->prepare(
    "SELECT user_id FROM shops WHERE user_id = ?"
  );
  $shopCheck->bind_param("i", $user_id);
  $shopCheck->execute();
  $add = $user["address"];
  if($add === "" || $add === null){
    $add = "no";
    
  }
  $upi = "no";

  if ($shopCheck->get_result()->num_rows === 0) {

    $insertShop = $conn->prepare(
      "INSERT INTO shops (
        user_id,
        unique_code,
        shop_name,
        address,
        image_url,
        cod,
        upi_id,
        rate_bw,
        rate_color,
        latitude,
        longitude,
        is_active
      ) VALUES (?, ?, ?, ?, NULL, 1, ?, 0, 0, 0, 0, 0)"
    );

    $code = generateRandomCode();
    $insertShop->bind_param(
      "issss",
      $user_id,
      $code,
      $user['full_name'],
      $add,
      $upi
    );

    $insertShop->execute();
  }
}

/* ===========================
   4️⃣ Success response
=========================== */
echo json_encode([
  "success" => true,
  "message" => "User role updated successfully"
]);
