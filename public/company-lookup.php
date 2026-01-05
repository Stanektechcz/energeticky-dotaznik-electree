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
    
    $context = stream_context_create([
        'http' => [
            'header' => [
                'Authorization: Token ' . $apiKey,
                'Accept: application/json',
                'User-Agent: FormApp/1.0'
            ],
            'method' => 'GET',
            'timeout' => 30
        ]
    ]);
    
    $response = @file_get_contents($url, false, $context);
    
    if ($response === false) {
        $error = error_get_last();
        return ['error' => true, 'message' => 'HTTP Error: ' . ($error['message'] ?? 'Unknown error')];
    }
    
    $data = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return ['error' => true, 'message' => 'JSON Parse Error: ' . json_last_error_msg(), 'raw_response' => $response];
    }
    
    return $data;
}

// Function to format response according to form requirements
function formatCompanyData($merkData) {
    if (isset($merkData['error']) && $merkData['error']) {
        return $merkData;
    }
    
    // Debug: Log the actual structure we received
    error_log("MERK API raw data structure: " . json_encode($merkData, JSON_UNESCAPED_UNICODE));
    
    // Extract relevant data from MERK API response
    // MERK API returns array of objects, take the first one
    if (is_array($merkData) && count($merkData) > 0) {
        $company = $merkData[0];
    } else {
        $company = $merkData;
    }
    
    // Check if data is empty or contains errors
    if (empty($company) || !is_array($company)) {
        error_log("Company data is empty or not array: " . gettype($company));
        return [
            'error' => true,
            'message' => 'No company data received from MERK API'
        ];
    }
    
    // Build formatted address
    $address = '';
    if (isset($company['address']) && is_array($company['address'])) {
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
    
    // Debug: Log what we're extracting
    $extractedData = [
        'ico' => $company['regno'] ?? $company['regno_str'] ?? '',
        'dic' => $company['vatno'] ?? '',
        'name' => $company['name'] ?? '',
        'address' => $address,
        'city' => $company['address']['municipality'] ?? '',
        'postal_code' => $company['address']['postal_code'] ?? '',
        'street' => $company['address']['street'] ?? '',
        'house_number' => $company['address']['number_descriptive'] ?? '',
        'orientation_number' => $company['address']['number_orientation'] ?? '',
        'is_active' => $company['is_active'] ?? false,
        'legal_form' => isset($company['legal_form']['text']) ? $company['legal_form']['text'] : '',
        'estab_date' => $company['estab_date'] ?? '',
        'is_vatpayer' => $company['is_vatpayer'] ?? false,
        'status' => isset($company['status']['text']) ? $company['status']['text'] : '',
        'court' => isset($company['court']['name']) ? $company['court']['name'] : '',
        'court_file' => isset($company['court']['file_nr']) ? $company['court']['file_nr'] : '',
        'industry' => isset($company['industry']['text']) ? $company['industry']['text'] : '',
        'magnitude' => isset($company['magnitude']['text']) ? $company['magnitude']['text'] : '',
        'turnover' => isset($company['turnover']['text']) ? $company['turnover']['text'] : '',
        'years_in_business' => $company['years_in_business'] ?? '',
        'databox_id' => !empty($company['databox_ids']) ? $company['databox_ids'][0] : '',
        'raw_data' => $company // Include full MERK data for debugging
    ];
    
    error_log("Extracted company data: " . json_encode($extractedData, JSON_UNESCAPED_UNICODE));
    
    return [
        'success' => true,
        'data' => $extractedData
    ];
}

try {
    // Call real MERK API
    $merkResponse = callMerkAPI($ico);
    
    // Format and return response
    $response = formatCompanyData($merkResponse);
    
    // Log for debugging
    error_log("MERK API Response for ICO $ico: " . json_encode($response, JSON_UNESCAPED_UNICODE));
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Server error: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
