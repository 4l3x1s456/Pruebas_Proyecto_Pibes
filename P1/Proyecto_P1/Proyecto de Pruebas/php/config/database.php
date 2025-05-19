<?php
class Database {
    private $host = "localhost";
    private $db_name = "ecommerce-shop";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new mysqli($this->host, $this->username, $this->password, $this->db_name);
            
            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }
            
            return $this->conn;
        } catch(Exception $exception) {
            throw new Exception("Connection error: " . $exception->getMessage());
        }
    }
}
?>