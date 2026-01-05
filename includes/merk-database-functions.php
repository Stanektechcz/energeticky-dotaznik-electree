<?php
/**
 * Funkce pro získání a uložení MERK API dat při submitu formuláře
 */

function fetchAndSaveMerkData($ico, $pdo, $formId) {
    if (empty($ico) || strlen($ico) !== 8) {
        return null;
    }
    
    try {
        $merkApiKey = 'k6WOe0eCN90UhUyhqbRW4QFfssSSh817';
        $baseUrl = 'https://api.merk.cz';
        
        // Hlavní company data
        $companyUrl = $baseUrl . '/company/?regno=' . urlencode($ico) . '&country_code=cz';
        $context = stream_context_create([
            'http' => [
                'header' => "Authorization: Token $merkApiKey\r\nContent-Type: application/json\r\n",
                'method' => 'GET',
                'timeout' => 15
            ]
        ]);
        
        $response = @file_get_contents($companyUrl, false, $context);
        
        if ($response === false) {
            // Fallback na ARES
            return fetchAresDataAsFallback($ico, $pdo, $formId);
        }
        
        $companyData = json_decode($response, true);
        
        if (!$companyData || !isset($companyData['data']) || empty($companyData['data'])) {
            return fetchAresDataAsFallback($ico, $pdo, $formId);
        }
        
        $company = $companyData['data'][0] ?? null;
        
        if (!$company) {
            return fetchAresDataAsFallback($ico, $pdo, $formId);
        }
        
        // Získání rozšířených dat z různých endpointů
        $extendedData = fetchAllMerkEndpoints($ico, $merkApiKey, $baseUrl);
        
        // Kompletní MERK API data struktura
        $merkApiData = [
            'company' => $company,
            'extended' => $extendedData,
            'metadata' => [
                'fetched_at' => date('Y-m-d H:i:s'),
                'source' => 'MERK',
                'ico' => $ico,
                'endpoints_success' => countSuccessfulEndpoints($extendedData)
            ]
        ];
        
        // Extrakce základních údajů
        $dic = $company['regno'] ?? null;
        $companyAddress = formatMerkAddress($company);
        
        // Uložení do databáze
        $stmt = $pdo->prepare("
            UPDATE forms SET 
                ico = ?,
                dic = ?,
                company_address = ?,
                merk_api_data = ?,
                merk_api_fetched_at = NOW(),
                merk_api_source = 'MERK'
            WHERE id = ?
        ");
        
        $result = $stmt->execute([
            $ico,
            $dic,
            $companyAddress,
            json_encode($merkApiData, JSON_UNESCAPED_UNICODE),
            $formId
        ]);
        
        if ($result) {
            error_log("MERK API data saved successfully for form $formId, ICO: $ico");
            return [
                'success' => true,
                'source' => 'MERK',
                'dic' => $dic,
                'address' => $companyAddress,
                'company_name' => $company['name'] ?? null
            ];
        }
        
    } catch (Exception $e) {
        error_log("Error fetching MERK data for ICO $ico: " . $e->getMessage());
        return fetchAresDataAsFallback($ico, $pdo, $formId);
    }
    
    return null;
}

function fetchAllMerkEndpoints($ico, $apiKey, $baseUrl) {
    $endpoints = [
        'business-premises' => '/company/business-premises/',
        'financial-statements' => '/company/financial-statements/',
        'financial-indicators' => '/company/financial-indicators/',
        'cz-financial-indicators' => '/company/cz-financial-indicators/',
        'cz-financial-statements' => '/company/cz-financial-statements/',
        'licenses' => '/company/licenses/',
        'fleet-stats' => '/company/fleet-stats/',
        'gov-contracts' => '/company/gov-contracts/',
        'job-ads' => '/company/job-ads/',
        'relations' => '/relations/company/'
    ];
    
    $data = [];
    
    foreach ($endpoints as $key => $endpoint) {
        $url = $baseUrl . $endpoint . '?regno=' . urlencode($ico) . '&country_code=cz';
        
        $context = stream_context_create([
            'http' => [
                'header' => "Authorization: Token $apiKey\r\nContent-Type: application/json\r\n",
                'method' => 'GET',
                'timeout' => 10
            ]
        ]);
        
        $response = @file_get_contents($url, false, $context);
        
        if ($response !== false) {
            $responseData = json_decode($response, true);
            if ($responseData && isset($responseData['data'])) {
                $data[$key] = $responseData['data'];
            }
        }
        
        // Pauza mezi požadavky
        usleep(200000); // 200ms
    }
    
    return $data;
}

function fetchAresDataAsFallback($ico, $pdo, $formId) {
    try {
        $aresUrl = "https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/" . $ico;
        
        $context = stream_context_create([
            'http' => [
                'header' => "Content-Type: application/json\r\n",
                'method' => 'GET',
                'timeout' => 10
            ]
        ]);
        
        $response = @file_get_contents($aresUrl, false, $context);
        
        if ($response === false) {
            return null;
        }
        
        $aresData = json_decode($response, true);
        
        if (!$aresData) {
            return null;
        }
        
        // Extrakce údajů z ARES
        $dic = $aresData['dic'] ?? null;
        $sidlo = $aresData['sidlo'] ?? [];
        $address = formatAresAddress($sidlo);
        $companyName = $aresData['obchodniJmeno'] ?? null;
        
        // Uložení ARES dat
        $aresApiData = [
            'ares_data' => $aresData,
            'metadata' => [
                'fetched_at' => date('Y-m-d H:i:s'),
                'source' => 'ARES',
                'ico' => $ico
            ]
        ];
        
        $stmt = $pdo->prepare("
            UPDATE forms SET 
                ico = ?,
                dic = ?,
                company_address = ?,
                merk_api_data = ?,
                merk_api_fetched_at = NOW(),
                merk_api_source = 'ARES'
            WHERE id = ?
        ");
        
        $result = $stmt->execute([
            $ico,
            $dic,
            $address,
            json_encode($aresApiData, JSON_UNESCAPED_UNICODE),
            $formId
        ]);
        
        if ($result) {
            error_log("ARES fallback data saved for form $formId, ICO: $ico");
            return [
                'success' => true,
                'source' => 'ARES',
                'dic' => $dic,
                'address' => $address,
                'company_name' => $companyName
            ];
        }
        
    } catch (Exception $e) {
        error_log("Error fetching ARES fallback data for ICO $ico: " . $e->getMessage());
    }
    
    return null;
}

function formatMerkAddress($company) {
    if (!isset($company['address'])) {
        return null;
    }
    
    // MERK už poskytuje formátovanou adresu
    return $company['address'];
}

function formatAresAddress($sidlo) {
    if (empty($sidlo)) {
        return null;
    }
    
    $addressParts = [];
    
    if (!empty($sidlo['nazevUlice'])) {
        $street = $sidlo['nazevUlice'];
        if (!empty($sidlo['cisloDomovni'])) {
            $street .= ' ' . $sidlo['cisloDomovni'];
        }
        if (!empty($sidlo['cisloOrientacni'])) {
            $street .= '/' . $sidlo['cisloOrientacni'];
        }
        $addressParts[] = $street;
    }
    
    $cityPart = '';
    if (!empty($sidlo['psc'])) {
        $cityPart .= $sidlo['psc'] . ' ';
    }
    if (!empty($sidlo['nazevObce'])) {
        $cityPart .= $sidlo['nazevObce'];
    }
    
    if ($cityPart) {
        $addressParts[] = trim($cityPart);
    }
    
    return implode(', ', $addressParts);
}

function countSuccessfulEndpoints($extendedData) {
    $count = 0;
    foreach ($extendedData as $data) {
        if (!empty($data)) {
            $count++;
        }
    }
    return $count;
}

/**
 * Funkce pro načtení uložených MERK API dat z databáze
 */
function getMerkDataFromDatabase($formId, $pdo) {
    try {
        $stmt = $pdo->prepare("
            SELECT ico, dic, company_address, merk_api_data, merk_api_fetched_at, merk_api_source 
            FROM forms 
            WHERE id = ?
        ");
        $stmt->execute([$formId]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result && !empty($result['merk_api_data'])) {
            $merkData = json_decode($result['merk_api_data'], true);
            
            return [
                'success' => true,
                'data' => $merkData,
                'metadata' => [
                    'ico' => $result['ico'],
                    'dic' => $result['dic'],
                    'address' => $result['company_address'],
                    'fetched_at' => $result['merk_api_fetched_at'],
                    'source' => $result['merk_api_source']
                ]
            ];
        }
        
    } catch (Exception $e) {
        error_log("Error loading MERK data from database: " . $e->getMessage());
    }
    
    return null;
}
?>
