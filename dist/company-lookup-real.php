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

// Function to call real MERK API
function callMerkAPI($ico) {
    $apiKey = 'k6WOe0eCN90UhUyhqbRW4QFfssSSh817';
    $url = "https://api.merk.cz/company/?regno=" . urlencode($ico);
    
    // Check if we can make HTTP requests
    if (!ini_get('allow_url_fopen')) {
        return ['error' => true, 'message' => 'HTTP requests not allowed in PHP configuration'];
    }
    
    $context = stream_context_create([
        'http' => [
            'header' => [
                'Authorization: Token ' . $apiKey,
                'Accept: application/json',
                'User-Agent: FormApp/1.0'
            ],
            'method' => 'GET',
            'timeout' => 10,
            'ignore_errors' => true
        ]
    ]);
    
    $response = @file_get_contents($url, false, $context);
    
    if ($response === false) {
        $error = error_get_last();
        return ['error' => true, 'message' => 'HTTP Error: ' . ($error['message'] ?? 'Unknown error')];
    }
    
    $data = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return ['error' => true, 'message' => 'JSON Parse Error: ' . json_last_error_msg(), 'raw_response' => substr($response, 0, 200)];
    }
    
    return $data;
}

// Function to format response according to form requirements
function formatCompanyData($merkData) {
    if (isset($merkData['error']) && $merkData['error']) {
        return $merkData;
    }
    
    // Log the raw MERK data for debugging
    error_log("Raw MERK API response: " . json_encode($merkData, JSON_UNESCAPED_UNICODE));
    
    // Check if we have a single company object or array of companies
    $company = $merkData;
    if (isset($merkData['results']) && is_array($merkData['results']) && count($merkData['results']) > 0) {
        $company = $merkData['results'][0];
    } elseif (isset($merkData[0]) && is_array($merkData[0])) {
        $company = $merkData[0];
    }
    
    // Build formatted address
    $address = '';
    if (isset($company['address'])) {
        $addr = $company['address'];
        $addressParts = [];
        
        if (!empty($addr['street'])) {
            $addressParts[] = $addr['street'];
        }
        if (!empty($addr['number_descriptive'])) {
            $addressParts[] = $addr['number_descriptive'];
            if (!empty($addr['number_orientation'])) {
                $addressParts[] = '/' . $addr['number_orientation'];
            }
        }
        
        $address = implode(' ', $addressParts);
        
        // Add municipality and postal code
        if (!empty($addr['municipality'])) {
            if (!empty($address)) $address .= ', ';
            $address .= $addr['municipality'];
        }
        if (!empty($addr['postal_code'])) {
            $address .= ' ' . $addr['postal_code'];
        }
    }
    
    // Alternative address format if lines are available
    if (empty($address) && isset($company['address']['lines']) && is_array($company['address']['lines'])) {
        $address = implode(', ', $company['address']['lines']);
    }
    
    // Alternative address format using text field
    if (empty($address) && isset($company['address']['text'])) {
        $address = $company['address']['text'];
    }
    
    $result = [
        'success' => true,
        'data' => [
            'ico' => $company['regno'] ?? $company['regno_str'] ?? '',
            'dic' => $company['regno'] ?? '',
            'name' => $company['name'] ?? '',
            'address' => $address,
            'city' => $company['address']['municipality'] ?? '',
            'postal_code' => $company['address']['postal_code'] ?? '',
            'street' => $company['address']['street'] ?? '',
            'house_number' => $company['address']['number_descriptive'] ?? '',
            'is_active' => $company['is_active'] ?? false,
            'legal_form' => $company['legal_form']['text'] ?? ($company['legal_form'] ?? ''),
            'estab_date' => $company['estab_date'] ?? '',
            'raw_data' => $company // Include full MERK data
        ]
    ];
    
    // Log the formatted result for debugging
    error_log("Formatted company data: " . json_encode($result, JSON_UNESCAPED_UNICODE));
    
    return $result;
}

try {
    // Log the incoming request
    error_log("MERK API request for ICO: $ico");
    
    // Try to call real MERK API first
    $merkResponse = callMerkAPI($ico);
    
    // Log raw API response
    error_log("Raw MERK API response: " . json_encode($merkResponse, JSON_UNESCAPED_UNICODE));
    
    // If API call fails, show clear message
    if (isset($merkResponse['error']) && $merkResponse['error']) {
        $response = [
            'error' => true,
            'message' => 'MERK API nedostupné: ' . $merkResponse['message'],
            'note' => 'Zkuste to prosím později nebo zadejte údaje manuálně'
        ];
    } else {
        // Format and return successful response
        $response = formatCompanyData($merkResponse);
    }
    
    // Log final response
    error_log("Final response for ICO $ico: " . json_encode($response, JSON_UNESCAPED_UNICODE));
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Server error: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
