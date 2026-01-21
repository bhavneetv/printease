<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); // frontend URL
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-USER-ID");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../../config/conn.php";


$user_id = $_SERVER['HTTP_X_USER_ID'] ?? null;

if (!$user_id || !is_numeric($user_id)) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "User not authenticated"
    ]);
    exit;
}

$user_id = (int)$user_id;


$sql = "
SELECT 
    -- Shop fields
    s.shop_name,
    s.address,
    
    s.is_active as shop_status,
    
    s.image_url as shop_image,
    s.rate_bw as bw_price,
    s.rate_color as color_price,
    s.upi_id,
    s.cod as accept_cash,
  
    -- User fields
    u.full_name AS owner_name,
    u.email,
    u.phone,

    (
        SELECT COUNT(*) 
        FROM orders o 
        WHERE o.accepted_by = s.user_id
    ) AS total_orders

FROM shops s
JOIN users u ON u.user_id = s.user_id
WHERE s.user_id = ?
LIMIT 1
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Shop profile not found"
    ]);
    exit;
}

$data = $result->fetch_assoc();


echo json_encode([
    "shop_name"        => $data['shop_name'] ?? "",
    "address"         => $data['address'] ?? "",
    "contact_number"  => $data['phone'] ?? "",       
    "email"           => $data['email'] ?? "",        
    "shop_status"       => $data['shop_status'] ?? "",    
    "visibility"      => $data['visibility'] ?? "public",
    "shop_image"      => "https://ui-avatars.com/api/?name=" . urlencode($data["shop_name"]) . "&background=667eea&color=fff&bold=true&size=120",
    "owner_name"      => $data['owner_name'] ?? "",
    "total_orders"    => (int)($data['total_orders'] ?? 0),
    "rating"          => (float)($data['rating'] ?? 0),
    "bw_price"        => (float)($data['bw_price'] ?? 0),
    "color_price"     => (float)($data['color_price'] ?? 0),
    "upi_id"          => $data['upi_id'] ?? "",
    "accept_cash"     => (bool)($data['accept_cash'] ?? true),
    "accept_upi"      => (bool)($data['accept_upi'] ?? true)
]);
