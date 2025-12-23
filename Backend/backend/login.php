<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require_once('../config/conn.php');

$data = json_decode(file_get_contents("php://input"), true);

$action = $data['action'] ?? '';
$email  = trim($data['email'] ?? '');
$pass   = $data['password'] ?? '';
$name   = trim($data['name'] ?? '');
$role   = $data['role'] ?? 'user'; // default role
$phone   = $data['phone'] ?? '0'; // default role

if (!$action || !$email || !$pass) {
    echo json_encode(["status" => false, "message" => "Missing fields"]);
    exit;
}

/* ================= SIGNUP ================= */
if ($action === "signup") {

    if (!$name) {
        echo json_encode(["status" => false, "message" => "Name required"]);
        exit;
    }

    // allow only valid roles
    $allowedRoles = ['user', 'shop', 'admin'];
    if (!in_array($role, $allowedRoles)) {
        $role = 'user';
    }

    // check email exists
    $check = $conn->prepare("SELECT user_id FROM users WHERE email=?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo json_encode(["status" => false, "message" => "Email already exists"]);
        exit;
    }

    $hashed = password_hash($pass, PASSWORD_DEFAULT);

    $stmt = $conn->prepare(
        "INSERT INTO users (full_name,email,password,role) VALUES (?,?,?,?)"
    );
    $stmt->bind_param("ssss", $name, $email, $hashed, $role);

    if ($stmt->execute()) {
        echo json_encode([
            "status" => true,
            "message" => "Signup successful",
            "user" => [
                "id" => $conn->insert_id,
                "name" => $name,
                "email" => $email,
                "role" => $role
            ]
        ]);
    } else {
        echo json_encode(["status" => false, "message" => "Signup failed"]);
    }
}

/* ================= LOGIN ================= */ elseif ($action === "login") {

    $stmt = $conn->prepare(
        "SELECT user_id,full_name,email,password,role FROM users WHERE email=?"
    );
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res->num_rows === 0) {
        echo json_encode(["status" => false, "message" => "Invalid email"]);
        exit;
    }

    $user = $res->fetch_assoc();

    if (!password_verify($pass, $user['password'])) {
        echo json_encode(["status" => false, "message" => "Wrong password"]);
        exit;
    }

    echo json_encode([
        "status" => true,
        "message" => "Login successful",
        "user" => [
            "id" => $user['user_id'],
            "name" => $user['full_name'],
            "email" => $email,
            "role" => $user['role']
        ]
    ]);
} else {
    echo json_encode(["status" => false, "message" => "Invalid action"]);
}
