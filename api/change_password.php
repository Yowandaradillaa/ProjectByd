<?php
// api/change_password.php (MODIFIED FOR PLAIN TEXT)

session_start();
header('Content-Type: application/json');
include_once '../config/database.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'You must be logged in to change your password.']);
    exit();
}

$database = new Database();
$db = $database->connect();

if (!isset($_POST['currentPassword']) || !isset($_POST['newPassword'])) {
    echo json_encode(['success' => false, 'message' => 'All password fields are required.']);
    exit();
}

$currentPassword = $_POST['currentPassword'];
$newPassword = $_POST['newPassword'];
$userId = $_SESSION['user_id'];

// 1. Fetch the user's current plain text password from the DB
$query = 'SELECT password FROM users WHERE id = :id';
$stmt = $db->prepare($query);
$stmt->bindParam(':id', $userId);
$stmt->execute();

if ($stmt->rowCount() > 0) {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $stored_password = $row['password'];

    // 2. Verify the submitted current password against the stored plain text password
    if ($currentPassword == $stored_password) {
        
        // 3. Update the database with the new PLAIN TEXT password
        $update_query = 'UPDATE users SET password = :password WHERE id = :id';
        $update_stmt = $db->prepare($update_query);
        $update_stmt->bindParam(':password', $newPassword); // We store the new password directly
        $update_stmt->bindParam(':id', $userId);

        if ($update_stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Password updated successfully!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update password.']);
        }
    } else {
        // The submitted current password was incorrect
        echo json_encode(['success' => false, 'message' => 'Your current password is incorrect.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User not found.']);
}
?>