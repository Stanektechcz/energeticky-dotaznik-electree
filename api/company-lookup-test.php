<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
    // Log request
    error_log("API Test - Request: " . $_SERVER['REQUEST_METHOD'] . " " . $_SERVER['REQUEST_URI']);
    
    $ico = $_GET['ico'] ?? null;
    
    if (!$ico) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'IČO je povinný parametr',
            'debug' => [
                'method' => $_SERVER['REQUEST_METHOD'],
                'get_params' => $_GET,
                'timestamp' => date('Y-m-d H:i:s')
            ]
        ]);
        exit;
    }
    
    // Validace IČO
    if (!preg_match('/^\d{8}$/', $ico)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'IČO musí mít 8 číslic',
            'debug' => [
                'ico_received' => $ico,
                'ico_length' => strlen($ico)
            ]
        ]);
        exit;
    }
    
    // Test MERK API
    $merkApiKey = 'k6WOe0eCN90UhUyhqbRW4QFfssSSh817';
    $merkUrl = "https://api.merk.cz/company/?regno=" . urlencode($ico) . "&country_code=cz";
    
    $merkContext = stream_context_create([
        'http' => [
            'header' => "Authorization: Token $merkApiKey\r\nContent-Type: application/json\r\n",
            'method' => 'GET',
            'timeout' => 10
        ]
    ]);
    
    error_log("API Test - Calling MERK: $merkUrl");
    
    $merkResponse = @file_get_contents($merkUrl, false, $merkContext);
    
    if ($merkResponse === false) {
        // Fallback response
        echo json_encode([
            'success' => true,
            'source' => 'TEST_FALLBACK',
            'data' => [
                'name' => 'Test Company s.r.o.',
                'regno' => $ico,
                'regno' => 'CZ' . $ico,
                'address' => 'Testovací ulice 123, 100 00 Praha',
                'phones' => ['+420 123 456 789'],
                'emails' => ['test@example.com']
            ],
            'debug' => [
                'merk_url' => $merkUrl,
                'merk_failed' => true,
                'timestamp' => date('Y-m-d H:i:s')
            ]
        ]);
        exit;
    }
    
    $merkData = json_decode($merkResponse, true);
    
    if (!$merkData || !isset($merkData['data']) || empty($merkData['data'])) {
        echo json_encode([
            'success' => false,
            'error' => 'Žádná data z MERK API',
            'debug' => [
                'merk_response_size' => strlen($merkResponse),
                'merk_data_parsed' => !!$merkData
            ]
        ]);
        exit;
    }
    
    $company = $merkData['data'][0];
    
    // Úspěšná odpověď
    echo json_encode([
        'success' => true,
        'source' => 'MERK',
        'data' => [
            'name' => $company['name'] ?? null,
            'regno' => $company['regno'] ?? $ico,
            'regno' => $company['regno'] ?? null,
            'address' => $company['address'] ?? null,
            'phones' => $company['phones'] ?? [],
            'emails' => $company['emails'] ?? []
        ],
        'debug' => [
            'merk_records_count' => count($merkData['data']),
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ]);
    
} catch (Exception $e) {
    error_log("API Test Error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error: ' . $e->getMessage(),
        'debug' => [
            'exception' => get_class($e),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]
    ]);
}
?>
