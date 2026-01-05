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

// Function to call MERK API
function callMerkAPI($ico) {
    $apiKey = 'k6WOe0eCN90UhUyhqbRW4QFfssSSh817';
    $url = "https://api.merk.cz/company/?regno=" . urlencode($ico);
    
    $headers = [
        'Authorization: Token ' . $apiKey,
        'Accept: application/json',
        'User-Agent: FormApp/1.0'
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        return ['error' => true, 'message' => 'CURL Error: ' . $error];
    }
    
    if ($httpCode !== 200) {
        return ['error' => true, 'message' => 'API Error: HTTP ' . $httpCode, 'response' => $response];
    }
    
    $data = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return ['error' => true, 'message' => 'JSON Parse Error: ' . json_last_error_msg()];
    }
    
    return $data;
}

// Function to format response according to form requirements
function formatCompanyData($merkData) {
    if (isset($merkData['error']) && $merkData['error']) {
        return $merkData;
    }
    
    // Extract relevant data from MERK API response
    $company = $merkData;
    
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
    
    return [
        'success' => true,
        'data' => [
            'ico' => $company['regno'] ?? '',
            'dic' => $company['regno'] ?? '',
            'name' => $company['name'] ?? '',
            'address' => $address,
            'city' => $company['address']['municipality'] ?? '',
            'postal_code' => $company['address']['postal_code'] ?? '',
            'street' => $company['address']['street'] ?? '',
            'house_number' => $company['address']['number_descriptive'] ?? '',
            'is_active' => $company['is_active'] ?? false,
            'legal_form' => $company['legal_form']['text'] ?? '',
            'estab_date' => $company['estab_date'] ?? '',
            'raw_data' => $company // Include full MERK data for debugging
        ]
    ];
}

try {
    // Call MERK API
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
