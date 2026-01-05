<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$ico = $_GET['ico'] ?? null;

if (!$ico) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'IČO je povinný parametr'
    ]);
    exit;
}

// Mockovaná data pro testování
$mockData = [
    '27082440' => [
        'name' => 'Alza.cz a.s.',
        'regno' => '27082440',
        'regno' => 'CZ27082440',
        'address' => 'Jankovcova 1522/53, 170 00 Praha 7',
        'phones' => ['+420 224 842 000'],
        'emails' => ['info@alza.cz']
    ],
    '12345678' => [
        'name' => 'Test Company s.r.o.',
        'regno' => '12345678',
        'regno' => 'CZ12345678',
        'address' => 'Testovací ulice 123, 100 00 Praha',
        'phones' => ['+420 123 456 789'],
        'emails' => ['test@example.com']
    ]
];

if (isset($mockData[$ico])) {
    echo json_encode([
        'success' => true,
        'source' => 'MOCK',
        'data' => $mockData[$ico],
        'debug' => [
            'timestamp' => date('Y-m-d H:i:s'),
            'ico_requested' => $ico
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Společnost s tímto IČO nebyla nalezena',
        'debug' => [
            'ico_requested' => $ico,
            'available_icos' => array_keys($mockData)
        ]
    ]);
}
?>
