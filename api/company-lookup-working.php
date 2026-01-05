<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Get IČO from URL parameter
$ico = isset($_GET['ico']) ? trim($_GET['ico']) : '';

if (empty($ico)) {
    http_response_code(400);
    echo json_encode([
        'error' => true,
        'message' => 'Chybí parametr ico'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Test response with mock data based on IČO
switch ($ico) {
    case '27082440':
        $response = [
            'success' => true,
            'data' => [
                'ico' => '27082440',
                'dic' => 'CZ27082440',
                'name' => 'MERK s.r.o.',
                'address' => 'Koněvova 2660/141, Praha 3 - Žižkov, 130 00',
                'city' => 'Praha 3 - Žižkov',
                'postal_code' => '130 00',
                'street' => 'Koněvova',
                'house_number' => '2660/141',
                'is_active' => true,
                'legal_form' => 'společnost s ručením omezeným',
                'estab_date' => '2006-01-30',
                'raw_data' => [
                    'emails' => [['email' => 'info@merk.cz']],
                    'phones' => [['phone' => '+420 222 317 111']],
                    'webs' => [['url' => 'https://www.merk.cz']]
                ]
            ]
        ];
        break;
        
    case '25596641':
        $response = [
            'success' => true,
            'data' => [
                'ico' => '25596641',
                'dic' => 'CZ25596641',
                'name' => 'Microsoft s.r.o.',
                'address' => 'Vyskočilova 1461/2a, Praha 4 - Michle, 140 00',
                'city' => 'Praha 4 - Michle',
                'postal_code' => '140 00', 
                'street' => 'Vyskočilova',
                'house_number' => '1461/2a',
                'is_active' => true,
                'legal_form' => 'společnost s ručením omezeným',
                'estab_date' => '1992-03-25',
                'raw_data' => [
                    'emails' => [['email' => 'info@microsoft.cz']],
                    'phones' => [['phone' => '+420 233 025 777']],
                    'webs' => [['url' => 'https://www.microsoft.com/cs-cz']]
                ]
            ]
        ];
        break;
        
    case '08094616':
        $response = [
            'success' => true,
            'data' => [
                'ico' => '08094616',
                'dic' => 'CZ08094616',
                'name' => 'Baterka Development s.r.o.',
                'address' => 'Testovací 123/45, Praha 1, 110 00',
                'city' => 'Praha 1',
                'postal_code' => '110 00',
                'street' => 'Testovací',
                'house_number' => '123/45',
                'is_active' => true,
                'legal_form' => 'společnost s ručením omezeným',
                'estab_date' => '2020-01-15',
                'raw_data' => [
                    'emails' => [['email' => 'kontakt@baterka.cz']],
                    'phones' => [['phone' => '+420 123 456 789']],
                    'webs' => [['url' => 'https://www.baterka.cz']]
                ]
            ]
        ];
        break;
        
    default:
        $response = [
            'error' => true,
            'message' => 'Společnost s IČO ' . $ico . ' nebyla nalezena'
        ];
        break;
}

// Log for debugging
error_log("API Test Response for ICO $ico: " . json_encode($response, JSON_UNESCAPED_UNICODE));

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
