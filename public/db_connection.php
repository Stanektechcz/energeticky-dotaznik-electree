<?php
/**
 * Databázové připojení pro admin rozhraní
 * Kompatibilní s existujícími soubory používajícími form-detail.php
 */

// Databázová konfigurace
$host = 's2.onhost.cz';
$dbname = 'OH_13_edele';
$username = 'OH_13_edele';
$password = 'stjTmLjaYBBKa9u9_U';

try {
    // Připojení přes mysqli pro zpětnou kompatibilitu
    $conn = new mysqli($host, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    // Nastavení kódování
    $conn->set_charset("utf8mb4");
    
    // PDO připojení pro moderní soubory
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    
} catch (Exception $e) {
    error_log("Database connection failed: " . $e->getMessage());
    die("Chyba připojení k databázi: " . $e->getMessage());
}

// Globální proměnné pro kompatibilitu
global $conn, $pdo;
?>
