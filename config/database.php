<?php
/**
 * Centrální databázová konfigurace
 * Používá se ve všech souborech pro konzistentní připojení k databázi
 */

// Databázová konfigurace
$host = 's2.onhost.cz';
$dbname = 'OH_13_edele';
$username = 'OH_13_edele';
$password = 'stjTmLjaYBBKa9u9_U';

// Funkce pro získání databázového připojení
function getDbConnection() {
    static $pdo = null;
    
    if ($pdo !== null) {
        return $pdo;
    }
    
    global $host, $dbname, $username, $password;
    
    try {
        $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
        $pdo = new PDO($dsn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        throw new Exception("Chyba připojení k databázi: " . $e->getMessage());
    }
}

// Export proměnných pro zpětnou kompatibilitu
return [
    'host' => $host,
    'dbname' => $dbname,
    'username' => $username,
    'password' => $password,
    'pdo' => function() { return getDbConnection(); }
];
?>
