<?php
// config/database.php

class Database {
    // Database Credentials for XAMPP
    private $host = 'localhost';        // Use 'localhost' for XAMPP (can also be '127.0.0.1')
    private $db_name = 'byd_db';        // Your database name
    private $username = 'root';         // Default username for XAMPP
    private $password = '';             // Default password for XAMPP is blank

    private $conn;

    // Database Connect function
    public function connect() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                'mysql:host=' . $this->host . ';dbname=' . $this->db_name . ';charset=utf8', 
                $this->username, 
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            // This line will print an error if the connection fails
            echo 'Connection Error: ' . $e->getMessage();
        }

        return $this->conn;
    }
}
?>