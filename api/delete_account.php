<?php
// api/delete_account.php

session_start();
header('Content-Type: application/json');
include_once '../config/database.php';

// 1. Check if the user is logged in. They can only delete their own account.
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Authentication required.']);
    exit();
}

$database = new Database();
$db = $database->connect();
$userId = $_SESSION['user_id'];

// 2. Prepare and execute the DELETE statement
$query = 'DELETE FROM users WHERE id = :id';
$stmt = $db->prepare($query);
$stmt->bindParam(':id', $userId);

// 3. Check if the deletion was successful
if ($stmt->execute()) {
    // 4. If the user is deleted, their session must also be destroyed.
    session_unset();
    session_destroy();

    echo json_encode(['success' => true, 'message' => 'Account deleted successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete account.']);
}
?>