<?php
include "config/conn.php";

define('FIREBASE_PROJECT_ID', 'unicart-35704');
define('FIREBASE_KEY_FILE', __DIR__ . '/service-acc.json');

function sendFCMNotification($user_id, $title, $message)
{
    global $conn;

    $stmt = $conn->prepare("SELECT fcm_token FROM users_fcm_tokens WHERE user_id=?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        return ["status" => false, "msg" => "FCM token not found"];
    }

    $token = $result->fetch_assoc()['fcm_token'];

    
    $accessToken = getFirebaseAccessToken();
    if (!$accessToken) {
        return ["status" => false, "msg" => "Access token error"];
    }

    return pushNotification($accessToken, $token, $title, $message);
}


function getFirebaseAccessToken()
{
    $key = json_decode(file_get_contents(FIREBASE_KEY_FILE), true);
    $now = time();

    $header = base64url_encode(json_encode([
        "alg" => "RS256",
        "typ" => "JWT"
    ]));

    $payload = base64url_encode(json_encode([
        "iss" => $key['client_email'],
        "scope" => "https://www.googleapis.com/auth/firebase.messaging",
        "aud" => "https://oauth2.googleapis.com/token",
        "iat" => $now,
        "exp" => $now + 3600
    ]));

    openssl_sign("$header.$payload", $signature, $key['private_key'], "SHA256");

    $jwt = "$header.$payload." . base64url_encode($signature);

    $response = curlPost("https://oauth2.googleapis.com/token", [
        "grant_type" => "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion" => $jwt
    ]);

    return $response['access_token'] ?? false;
}

function pushNotification($accessToken, $fcmToken, $title, $body)
{
    $url = "https://fcm.googleapis.com/v1/projects/" . FIREBASE_PROJECT_ID . "/messages:send";

    $data = [
        "message" => [
            "token" => $fcmToken,
            "notification" => [
                "title" => $title,
                "body" => $body
            ]
        ]
    ];

    return curlJson($url, $data, $accessToken);
}

/* ================================
   HELPERS
================================ */
function curlPost($url, $data)
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query($data),
        CURLOPT_HTTPHEADER => ["Content-Type: application/x-www-form-urlencoded"]
    ]);

    $res = curl_exec($ch);
    curl_close($ch);
    return json_decode($res, true);
}

function curlJson($url, $data, $token)
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer $token",
            "Content-Type: application/json"
        ]
    ]);

    $res = curl_exec($ch);
    curl_close($ch);
    return json_decode($res, true);
}

function base64url_encode($data)
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}
