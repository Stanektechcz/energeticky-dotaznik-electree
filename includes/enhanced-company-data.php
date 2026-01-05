<?php
/**
 * Funkce pro načítání rozšířených údajů společnosti z MERK API
 * pro zobrazení v administraci formulářů
 */

function getEnhancedCompanyData($ico, $dic = null) {
    if (empty($ico)) {
        return null;
    }
    
    $results = [
        'source' => 'none',
        'success' => false,
        'data' => [],
        'debug' => []
    ];
    
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
            $results['raw_data'] = $company; // Uložíme i raw data pro debug
            
            // Rozšířené zpracování všech dostupných údajů
            $results['data'] = [
                // Základní identifikace
                'basic_info' => [
                    'name' => $company['name'] ?? '',
                    'regno' => $company['regno'] ?? '',
                    'regno' => $company['regno'] ?? $ico,
                    'legal_form' => [
                        'text' => $company['legal_form']['text'] ?? '',
                        'code' => $company['legal_form']['code'] ?? ''
                    ],
                    'status' => $company['status'] ?? '',
                    'estab_date' => $company['estab_date'] ?? '',
                    'termination_date' => $company['termination_date'] ?? '',
                ],
                
                // Adresní údaje
                'address' => formatEnhancedMerkAddress($company['address'] ?? []),
                
                // Kontaktní údaje
                'contacts' => extractAllContacts($company),
                'phones' => extractAllPhones($company),
                'emails' => extractAllEmails($company),
                'webs' => extractAllWebsites($company),
                
                // Obchodní informace
                'business_info' => [
                    'industry' => [
                        'text' => $company['industry']['text'] ?? '',
                        'code' => $company['industry']['code'] ?? '',
                        'nace' => $company['nace'] ?? []
                    ],
                    'magnitude' => [
                        'text' => $company['magnitude']['text'] ?? '',
                        'code' => $company['magnitude']['code'] ?? ''
                    ],
                    'employee_count' => $company['employee_count'] ?? '',
                    'revenue' => $company['revenue'] ?? [],
                    'profit' => $company['profit'] ?? [],
                ],
                
                // Finanční údaje (pokud dostupné)
                'financial_info' => [
                    'revenue_data' => $company['revenue'] ?? [],
                    'profit_data' => $company['profit'] ?? [],
                    'assets' => $company['assets'] ?? [],
                    'equity' => $company['equity'] ?? [],
                    'year' => $company['year'] ?? ''
                ],
                
                // Další informace
                'additional_info' => [
                    'description' => $company['description'] ?? '',
                    'activities' => $company['activities'] ?? [],
                    'branches' => $company['branches'] ?? [],
                    'subsidiaries' => $company['subsidiaries'] ?? [],
                    'parent_company' => $company['parent_company'] ?? [],
                ],
                
                // Metadata
                'metadata' => [
                    'last_update' => $company['last_update'] ?? '',
                    'data_quality' => $company['data_quality'] ?? '',
                    'completeness' => calculateDataCompleteness($company)
                ]
            ];
            
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
            $results['raw_data'] = $company;
            
            $results['data'] = [
                'basic_info' => [
                    'name' => $company['obchodniJmeno'] ?? '',
                    'regno' => $company['dic'] ?? '',
                    'regno' => $ico,
                    'legal_form' => [
                        'text' => $company['pravniForma']['nazev'] ?? '',
                        'code' => $company['pravniForma']['kod'] ?? ''
                    ],
                    'status' => $company['stavSubjektu'] ?? '',
                    'estab_date' => $company['datumVznikuSubjektu'] ?? '',
                    'termination_date' => $company['datumZanikuSubjektu'] ?? '',
                ],
                'address' => formatEnhancedAresAddress($company['adresaDorucovaci'] ?? $company['adresaSidlo'] ?? []),
                'contacts' => [],
                'phones' => [],
                'emails' => [],
                'webs' => [],
                'business_info' => [
                    'industry' => ['text' => '', 'code' => '', 'nace' => []],
                    'magnitude' => ['text' => '', 'code' => ''],
                    'employee_count' => '',
                    'revenue' => [],
                    'profit' => [],
                ],
                'financial_info' => [],
                'additional_info' => [],
                'metadata' => [
                    'last_update' => $company['datumPosledniZmeny'] ?? '',
                    'data_quality' => 'basic',
                    'completeness' => 25 // ARES má méně dat
                ]
            ];
            
            return $results;
        }
    }
    
    return $results;
}

function formatEnhancedMerkAddress($address) {
    if (empty($address)) return [];
    
    return [
        'formatted' => formatMerkAddressString($address),
        'street' => $address['street_fixed'] ?? $address['street'] ?? '',
        'number' => $address['number'] ?? '',
        'city' => $address['municipality'] ?? $address['municipality_first'] ?? '',
        'postal_code' => $address['postal_code'] ?? '',
        'district' => $address['district'] ?? '',
        'region' => $address['region'] ?? '',
        'country' => $address['country'] ?? 'Česká republika',
        'coordinates' => [
            'lat' => $address['lat'] ?? '',
            'lng' => $address['lng'] ?? ''
        ]
    ];
}

function formatEnhancedAresAddress($address) {
    if (empty($address)) return [];
    
    return [
        'formatted' => formatAresAddressString($address),
        'street' => $address['nazevUlice'] ?? '',
        'number' => ($address['cisloDomovni'] ?? '') . ($address['cisloOrientacni'] ? '/' . $address['cisloOrientacni'] : ''),
        'city' => $address['nazevObce'] ?? '',
        'postal_code' => $address['psc'] ?? '',
        'district' => $address['nazevCastiObce'] ?? '',
        'region' => '',
        'country' => 'Česká republika',
        'coordinates' => ['lat' => '', 'lng' => '']
    ];
}

function formatMerkAddressString($address) {
    $parts = [];
    
    if (!empty($address['street_fixed']) || !empty($address['street'])) {
        $streetPart = $address['street_fixed'] ?? $address['street'];
        if (!empty($address['number'])) {
            $streetPart .= ' ' . $address['number'];
        }
        $parts[] = $streetPart;
    }
    
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

function formatAresAddressString($address) {
    $parts = [];
    
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

function extractAllContacts($company) {
    $contacts = [];
    
    // Standardní kontakty
    if (isset($company['contacts']) && is_array($company['contacts'])) {
        foreach ($company['contacts'] as $contact) {
            if (is_array($contact)) {
                $contacts[] = [
                    'name' => $contact['name'] ?? $contact['person'] ?? '',
                    'position' => $contact['position'] ?? $contact['function'] ?? '',
                    'phone' => $contact['phone'] ?? '',
                    'email' => $contact['email'] ?? '',
                    'type' => 'contact'
                ];
            }
        }
    }
    
    // Manažeři a ředitelé
    $roles = ['managers', 'directors', 'persons', 'representatives', 'executives'];
    foreach ($roles as $role) {
        if (isset($company[$role]) && is_array($company[$role])) {
            foreach ($company[$role] as $person) {
                if (is_array($person) && !empty($person['name'])) {
                    $contacts[] = [
                        'name' => $person['name'] ?? '',
                        'position' => $person['position'] ?? $person['function'] ?? $role,
                        'phone' => $person['phone'] ?? '',
                        'email' => $person['email'] ?? '',
                        'type' => $role
                    ];
                }
            }
        }
    }
    
    return $contacts;
}

function extractAllPhones($company) {
    $phones = [];
    
    if (isset($company['phones']) && is_array($company['phones'])) {
        foreach ($company['phones'] as $phone) {
            if (is_array($phone)) {
                $phones[] = [
                    'number' => $phone['number'] ?? $phone['phone'] ?? '',
                    'type' => $phone['type'] ?? 'main',
                    'description' => $phone['description'] ?? ''
                ];
            } elseif (is_string($phone)) {
                $phones[] = ['number' => $phone, 'type' => 'main', 'description' => ''];
            }
        }
    }
    
    return $phones;
}

function extractAllEmails($company) {
    $emails = [];
    
    if (isset($company['emails']) && is_array($company['emails'])) {
        foreach ($company['emails'] as $email) {
            if (is_string($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $emails[] = ['email' => $email, 'type' => 'main'];
            } elseif (is_array($email) && !empty($email['email'])) {
                $emails[] = [
                    'email' => $email['email'],
                    'type' => $email['type'] ?? 'main'
                ];
            }
        }
    }
    
    return $emails;
}

function extractAllWebsites($company) {
    $websites = [];
    
    if (isset($company['webs']) && is_array($company['webs'])) {
        foreach ($company['webs'] as $web) {
            if (is_array($web)) {
                $websites[] = [
                    'url' => $web['url'] ?? '',
                    'type' => $web['type'] ?? 'website'
                ];
            } elseif (is_string($web)) {
                $websites[] = ['url' => $web, 'type' => 'website'];
            }
        }
    }
    
    // Zkontroluj také pole 'websites'
    if (isset($company['websites']) && is_array($company['websites'])) {
        foreach ($company['websites'] as $web) {
            if (is_array($web)) {
                $websites[] = [
                    'url' => $web['url'] ?? $web['website'] ?? '',
                    'type' => $web['type'] ?? 'website'
                ];
            } elseif (is_string($web)) {
                $websites[] = ['url' => $web, 'type' => 'website'];
            }
        }
    }
    
    // Zkontroluj pole 'web'
    if (isset($company['web']) && !empty($company['web'])) {
        if (is_string($company['web'])) {
            $websites[] = ['url' => $company['web'], 'type' => 'website'];
        }
    }
    
    return $websites;
}

function calculateDataCompleteness($company) {
    $totalFields = 0;
    $filledFields = 0;
    
    $importantFields = [
        'name', 'regno', 'regno', 'address', 'legal_form', 
        'industry', 'contacts', 'phones', 'emails'
    ];
    
    foreach ($importantFields as $field) {
        $totalFields++;
        if (isset($company[$field]) && !empty($company[$field])) {
            $filledFields++;
        }
    }
    
    return round(($filledFields / $totalFields) * 100);
}
?>
