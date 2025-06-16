<?php
// api/register.php (MODIFIED FOR PLAIN TEXT)

header('Content-Type: application/json');
include_once '../config/database.php';

$database = new Database();
$db = $database->connect();

if (!isset($_POST['username']) || !isset($_POST['password'])) {
    echo json_encode(['success' => false, 'message' => 'Username and password are required.']);
    exit();
}

$username = $_POST['username'];
$password = $_POST['password']; // We will save this directly

// Check if username already exists
$query = 'SELECT id FROM users WHERE username = :username';
$stmt = $db->prepare($query);
$stmt->bindParam(':username', $username);
$stmt->execute();

if($stmt->rowCount() > 0) {
    echo json_encode(['success' => false, 'message' => 'Username already exists.']);
    exit();
}

// REMOVED THE HASHING
// $hashed_password = password_hash($password, PASSWORD_BCRYPT);

$query = 'INSERT INTO users (username, password, role) VALUES (:username, :password, "user")';
$stmt = $db->prepare($query);

$stmt->bindParam(':username', $username);
// CHANGED THIS LINE: We bind the original plain password, not the hash
$stmt->bindParam(':password', $password);

if($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'User registered successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'User registration failed.']);
}
?>