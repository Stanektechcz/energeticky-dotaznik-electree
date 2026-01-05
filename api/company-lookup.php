<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

function getCompanyData($ico) {
    $results = [];
    
    // Zkus MERK API
    $merkApiKey = 'k6WOe0eCN90UhUyhqbRW4QFfssSSh817';
    $merkUrl = "https://api.merk.cz/company/?regno=" . urlencode($ico) . "&country_code=cz";
    
    $merkContext = stream_context_create([
        'http' => [
            'header' => "Authorization: Token $merkApiKey\r\nContent-Type: application/json\r\n",
            'method' => 'GET',
            'timeout' => 10
        ]
    ]);
    
    $merkResponse = @file_get_contents($merkUrl, false, $merkContext);
    
    if ($merkResponse !== false) {
        $merkData = json_decode($merkResponse, true);
        
        if ($merkData && (is_array($merkData) ? count($merkData) > 0 : !empty($merkData))) {
            $company = is_array($merkData) ? $merkData[0] : $merkData;
            
            $results['source'] = 'merk';
            $results['success'] = true;
            $results['debug'] = [
                'raw_contacts' => $company['contacts'] ?? [],
                'raw_phones' => $company['phones'] ?? [],
                'raw_emails' => $company['emails'] ?? [],
                'all_fields' => array_keys($company)
            ];
            
            // Rozšířené zpracování kontaktních údajů
            $processedData = [
                'name' => $company['name'] ?? '',
                'regno' => $company['regno'] ?? '',
                'address' => formatMerkAddress($company['address'] ?? []),
                'contacts' => extractContacts($company),
                'phones' => extractPhones($company),
                'emails' => extractEmails($company),
                'legal_form' => $company['legal_form'] ?? [],
                'industry' => $company['industry'] ?? [],
                'magnitude' => $company['magnitude'] ?? [],
                'estab_date' => $company['estab_date'] ?? '',
                'webs' => $company['webs'] ?? []
            ];
            
            $results['data'] = $processedData;
            return $results;
        }
    }
    
    // Záložní ARES API
    $aresUrl = "https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/" . urlencode($ico);
    $aresResponse = @file_get_contents($aresUrl);
    
    if ($aresResponse !== false) {
        $aresData = json_decode($aresResponse, true);
        
        if ($aresData && isset($aresData['ekonomickySubjekt'])) {
            $company = $aresData['ekonomickySubjekt'];
            
            $results['source'] = 'ares';
            $results['success'] = true;
            $results['debug'] = [
                'all_fields' => array_keys($company)
            ];
            $results['data'] = [
                'name' => $company['obchodniJmeno'] ?? '',
                'regno' => $company['dic'] ?? '',
                'address' => formatAresAddress($company['adresaDorucovaci'] ?? $company['adresaSidlo'] ?? []),
                'contacts' => [],
                'phones' => [],
                'emails' => [],
                'legal_form' => ['text' => $company['pravniForma']['nazev'] ?? ''],
                'industry' => ['text' => ''],
                'magnitude' => ['text' => ''],
                'estab_date' => $company['datumVznikuSubjektu'] ?? '',
                'webs' => []
            ];
            
            return $results;
        }
    }
    
    return [
        'source' => 'none',
        'success' => false,
        'error' => 'Společnost nebyla nalezena'
    ];
}

// Nové funkce pro extrakci kontaktních údajů
function extractContacts($company) {
    $contacts = [];
    
    // Primární kontakty z contacts pole
    if (isset($company['contacts']) && is_array($company['contacts'])) {
        foreach ($company['contacts'] as $contact) {
            if (is_array($contact)) {
                $contacts[] = [
                    'name' => $contact['name'] ?? $contact['person'] ?? '',
                    'position' => $contact['position'] ?? $contact['function'] ?? '',
                    'phone' => $contact['phone'] ?? '',
                    'email' => $contact['email'] ?? ''
                ];
            }
        }
    }
    
    // Hledání kontaktů v dalších polích
    $possibleContactFields = ['managers', 'directors', 'persons', 'representatives'];
    foreach ($possibleContactFields as $field) {
        if (isset($company[$field]) && is_array($company[$field])) {
            foreach ($company[$field] as $person) {
                if (is_array($person) && !empty($person['name'])) {
                    $contacts[] = [
                        'name' => $person['name'] ?? '',
                        'position' => $person['position'] ?? $person['function'] ?? '',
                        'phone' => $person['phone'] ?? '',
                        'email' => $person['email'] ?? ''
                    ];
                }
            }
        }
    }
    
    return $contacts;
}

function extractPhones($company) {
    $phones = [];
    
    // Přímé telefony
    if (isset($company['phones']) && is_array($company['phones'])) {
        foreach ($company['phones'] as $phone) {
            if (is_array($phone)) {
                $phones[] = [
                    'number' => $phone['number'] ?? $phone['phone'] ?? '',
                    'type' => $phone['type'] ?? 'main'
                ];
            } elseif (is_string($phone)) {
                $phones[] = ['number' => $phone, 'type' => 'main'];
            }
        }
    }
    
    // Telefony z kontaktů
    if (isset($company['contacts']) && is_array($company['contacts'])) {
        foreach ($company['contacts'] as $contact) {
            if (is_array($contact) && !empty($contact['phone'])) {
                $phones[] = [
                    'number' => $contact['phone'],
                    'type' => 'contact'
                ];
            }
        }
    }
    
    // Hledání v dalších polích
    foreach ($company as $key => $value) {
        if (stripos($key, 'phone') !== false || stripos($key, 'telefon') !== false) {
            if (is_string($value) && !empty($value)) {
                $phones[] = ['number' => $value, 'type' => 'other'];
            } elseif (is_array($value)) {
                foreach ($value as $item) {
                    if (is_string($item) && !empty($item)) {
                        $phones[] = ['number' => $item, 'type' => 'other'];
                    }
                }
            }
        }
    }
    
    return $phones;
}

function extractEmails($company) {
    $emails = [];
    
    // Přímé emaily
    if (isset($company['emails']) && is_array($company['emails'])) {
        foreach ($company['emails'] as $email) {
            if (is_string($email) && !empty($email)) {
                $emails[] = $email;
            } elseif (is_array($email) && !empty($email['email'])) {
                $emails[] = $email['email'];
            }
        }
    }
    
    // Emaily z kontaktů
    if (isset($company['contacts']) && is_array($company['contacts'])) {
        foreach ($company['contacts'] as $contact) {
            if (is_array($contact) && !empty($contact['email'])) {
                $emails[] = $contact['email'];
            }
        }
    }
    
    // Hledání v dalších polích
    foreach ($company as $key => $value) {
        if (stripos($key, 'email') !== false || stripos($key, 'mail') !== false) {
            if (is_string($value) && !empty($value) && filter_var($value, FILTER_VALIDATE_EMAIL)) {
                $emails[] = $value;
            } elseif (is_array($value)) {
                foreach ($value as $item) {
                    if (is_string($item) && !empty($item) && filter_var($item, FILTER_VALIDATE_EMAIL)) {
                        $emails[] = $item;
                    }
                }
            }
        }
    }
    
    // Remove duplicates
    return array_unique($emails);
}

function formatMerkAddress($address) {
    if (empty($address)) return '';
    
    $parts = [];
    
    // Ulice a číslo
    if (!empty($address['street_fixed']) || !empty($address['street'])) {
        $streetPart = $address['street_fixed'] ?? $address['street'];
        if (!empty($address['number'])) {
            $streetPart .= ' ' . $address['number'];
        }
        $parts[] = $streetPart;
    }
    
    // Město a PSČ
    $cityPart = '';
    if (!empty($address['postal_code'])) {
        $cityPart = preg_replace('/(\d{3})(\d{2})/', '$1 $2', $address['postal_code']);
    }
    if (!empty($address['municipality']) || !empty($address['municipality_first'])) {
        $city = $address['municipality'] ?? $address['municipality_first'];
        $cityPart .= ($cityPart ? ' ' : '') . $city;
    }
    if ($cityPart) {
        $parts[] = $cityPart;
    }
    
    return implode(', ', $parts);
}

function formatAresAddress($address) {
    if (empty($address)) return '';
    
    $parts = [];
    
    // Ulice a číslo
    if (!empty($address['nazevUlice'])) {
        $streetPart = $address['nazevUlice'];
        if (!empty($address['cisloDomovni'])) {
            $streetPart .= ' ' . $address['cisloDomovni'];
            if (!empty($address['cisloOrientacni'])) {
                $streetPart .= '/' . $address['cisloOrientacni'];
            }
        }
        $parts[] = $streetPart;
    }
    
    // Město a PSČ
    $cityPart = '';
    if (!empty($address['psc'])) {
        $cityPart = preg_replace('/(\d{3})(\d{2})/', '$1 $2', $address['psc']);
    }
    if (!empty($address['nazevObce'])) {
        $cityPart .= ($cityPart ? ' ' : '') . $address['nazevObce'];
    }
    if ($cityPart) {
        $parts[] = $cityPart;
    }
    
    return implode(', ', $parts);
}

// Získej IČO z parametrů
$ico = $_GET['ico'] ?? $_POST['ico'] ?? '';

if (empty($ico)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'IČO je povinný parametr'
    ]);
    exit;
}

// Validace IČO
if (!preg_match('/^\d{8}$/', $ico)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'IČO musí mít 8 číslic'
    ]);
    exit;
}

// Získej data společnosti
$result = getCompanyData($ico);

echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>
