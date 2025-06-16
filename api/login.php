<?php
// api/login.php (MODIFIED FOR PLAIN TEXT)

session_start();
header('Content-Type: application/json');
include_once '../config/database.php';

$database = new Database();
$db = $database->connect();

if (!isset($_POST['username']) || !isset($_POST['password'])) {
    echo json_encode(['success' => false, 'message' => 'Username and password are required.']);
    exit();
}

$username = $_POST['username'];
$password = $_POST['password'];

$query = 'SELECT id, username, password, role FROM users WHERE username = :username';
$stmt = $db->prepare($query);
$stmt->bindParam(':username', $username);
$stmt->execute();

if($stmt->rowCount() > 0) {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // CHANGED THIS LINE: Simple string comparison instead of password_verify()
    if ($password == $row['password']) {
        $_SESSION['user_id'] = $row['id'];
        $_SESSION['username'] = $row['username'];
        $_SESSION['role'] = $row['role'];

        echo json_encode([
            'success' => true,
            'message' => 'Login successful.',
            'username' => $row['username'],
            'role' => $row['role']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid password.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User not found.']);
}
?>