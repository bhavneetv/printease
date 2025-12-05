<?php
header("Content-Type: application/json");
include "../config/conn.php";

$data = json_decode(file_get_contents("php://input"), true);
$userLat = $data["lat"];
$userLng = $data["lng"];

function distance($lat1, $lon1, $lat2, $lon2) {
    $earthRadius = 6371;
    $dLat = deg2rad($lat2 - $lat1);
    $dLon = deg2rad($lon2 - $lon1);

    $a = sin($dLat/2) * sin($dLat/2) +
         cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
         sin($dLon/2) * sin($dLon/2);

    return $earthRadius * (2 * atan2(sqrt($a), sqrt(1-$a)));
}

$sql = "SELECT shop_id, shop_name, rate_bw, rate_color, latitude, longitude , cod FROM shops";
$res = mysqli_query($conn, $sql);

$shops = [];

while ($row = mysqli_fetch_assoc($res)) {
    $dist = distance($userLat, $userLng, $row['latitude'], $row['longitude']);
    if ($dist <= 10) {
        $row["distance_km"] = round($dist, 2);
        $shops[] = $row;
    }
}

echo json_encode([
    "success" => true,
    "shops" => $shops
]);
