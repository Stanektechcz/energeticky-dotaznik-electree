<?php
// Minimální auth.php pro debug - verze 1
// Vypnout všechny chyby které by mohly crashnout script
ini_set('display_errors', 0);
error_reporting(0);

// Nastavit headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// CORS preflight
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// První test - minimální odpověď
echo json_encode([
    'success' => true,
    'message' => 'Minimální auth.php funguje!',
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => PHP_VERSION,
    'method' => $_SERVER['REQUEST_METHOD'] ?? 'unknown'
]);
exit;
?>