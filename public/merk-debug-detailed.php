<?php
header('Content-Type: text/plain; charset=utf-8');

// Get IČO from URL parameter
$ico = isset($_GET['ico']) ? trim($_GET['ico']) : '08094616';

echo "=== MERK API Debug Test ===\n";
echo "Testing ICO: $ico\n\n";

$apiKey = 'k6WOe0eCN90UhUyhqbRW4QFfssSSh817';
$url = "https://api.merk.cz/company/?regno=" . urlencode($ico);

echo "API URL: $url\n";
echo "API Key: " . substr($apiKey, 0, 10) . "...\n\n";

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

echo "Making API call...\n";
$response = @file_get_contents($url, false, $context);

if ($response === false) {
    $error = error_get_last();
    echo "ERROR: " . ($error['message'] ?? 'Unknown error') . "\n";
    exit;
}

echo "SUCCESS! Response received.\n";
echo "Response length: " . strlen($response) . " characters\n\n";

echo "=== RAW RESPONSE ===\n";
echo $response . "\n\n";

$data = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo "JSON Parse Error: " . json_last_error_msg() . "\n";
    exit;
}

echo "=== PARSED JSON STRUCTURE ===\n";
echo "Data type: " . gettype($data) . "\n";

if (is_array($data)) {
    echo "Top-level keys: " . implode(', ', array_keys($data)) . "\n\n";
    
    echo "=== DETAILED STRUCTURE ===\n";
    foreach ($data as $key => $value) {
        echo "$key: " . gettype($value);
        if (is_string($value)) {
            echo " = '" . (strlen($value) > 50 ? substr($value, 0, 50) . '...' : $value) . "'";
        } elseif (is_array($value)) {
            echo " (array with " . count($value) . " items)";
            if (!empty($value)) {
                echo " - keys: " . implode(', ', array_keys($value));
            }
        } elseif (is_bool($value)) {
            echo " = " . ($value ? 'true' : 'false');
        } elseif (is_null($value)) {
            echo " = null";
        }
        echo "\n";
    }
} else {
    echo "Data is not an array!\n";
    var_dump($data);
}

echo "\n=== EXPECTED FIELDS CHECK ===\n";
$expectedFields = ['regno', 'vatno', 'name', 'address', 'is_active', 'legal_form', 'estab_date', 'emails', 'phones', 'webs'];
foreach ($expectedFields as $field) {
    $exists = isset($data[$field]);
    echo "$field: " . ($exists ? "EXISTS" : "MISSING");
    if ($exists) {
        echo " (" . gettype($data[$field]) . ")";
        if (is_string($data[$field])) {
            echo " = '" . (strlen($data[$field]) > 30 ? substr($data[$field], 0, 30) . '...' : $data[$field]) . "'";
        }
    }
    echo "\n";
}
?>
