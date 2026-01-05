<?php
require_once 'db_connection.php';

// Start session bezpečně
if (session_status() === PHP_SESSION_NONE) {
    @session_start();
}

// Získání ID formuláře z URL
$form_id = $_GET['id'] ?? null;

if (!$form_id) {
    echo "ID formuláře nebylo poskytnuto";
    exit();
}

// Načtení dat z databáze
$stmt = $conn->prepare("SELECT * FROM forms WHERE id = ?");
$stmt->bind_param("i", $form_id);
$stmt->execute();
$result = $stmt->get_result();
$form_data = $result->fetch_assoc();

if (!$form_data) {
    echo "Formulář nenalezen";
    exit();
}

// Dekódování dat formuláře
$decoded_data = json_decode($form_data['form_data'], true);
$step_notes = $decoded_data['stepNotes'] ?? [];

// Názvy kroků odpovídající skutečnému formuláři
$step_names = [
    1 => 'Identifikační údaje zákazníka',
    2 => 'Parametry odběrného místa',
    3 => 'Spotřeba a rozložení',
    4 => 'Analýza spotřeby a akumulace',
    5 => 'Cíle a optimalizace',
    6 => 'Místo realizace a infrastruktura',
    7 => 'Připojení k síti a legislativa',
    8 => 'Energetická fakturace a bilancování'
];
// Ikony pro kroky
function getStepIcon($step) {
    $icons = [
        1 => 'fas fa-user-circle',
        2 => 'fas fa-bolt',
        3 => 'fas fa-chart-line',
        4 => 'fas fa-battery-half',
        5 => 'fas fa-bullseye',
        6 => 'fas fa-building',
        7 => 'fas fa-plug',
        8 => 'fas fa-file-invoice-dollar'
    ];
    return $icons[$step] ?? 'fas fa-file';
}

// Gradienty pro kroky
function getStepGradient($step) {
    $gradients = [
        1 => 'from-blue-500 to-blue-600',
        2 => 'from-green-500 to-green-600',
        3 => 'from-purple-500 to-purple-600',
        4 => 'from-orange-500 to-orange-600',
        5 => 'from-red-500 to-red-600',
        6 => 'from-indigo-500 to-indigo-600',
        7 => 'from-yellow-500 to-yellow-600',
        8 => 'from-pink-500 to-pink-600'
    ];
    return $gradients[$step] ?? 'from-gray-500 to-gray-600';
}

// Ikony pro pole
function getFieldIcon($field) {
    $icons = [
        // Základní údaje
        'companyName' => 'fas fa-building',
        'ico' => 'fas fa-hashtag',
        'dic' => 'fas fa-file-text',
        'contactPerson' => 'fas fa-user',
        'email' => 'fas fa-envelope',
        'phone' => 'fas fa-phone',
        'address' => 'fas fa-map-marker-alt',
        'companyAddress' => 'fas fa-building',
        'customerType' => 'fas fa-tags',
        
        // Technické parametry
        'hasFveVte' => 'fas fa-solar-panel',
        'fveVtePower' => 'fas fa-bolt',
        'hasTransformer' => 'fas fa-plug',
        'transformerPower' => 'fas fa-plug',
        'circuitBreakerType' => 'fas fa-toggle-on',
        'mainCircuitBreaker' => 'fas fa-toggle-on',
        'reservedPower' => 'fas fa-battery-full',
        'monthlyConsumption' => 'fas fa-chart-bar',
        'yearlyConsumption' => 'fas fa-chart-pie',
        
        // Cíle a plány
        'goals' => 'fas fa-target',
        'batteryCapacity' => 'fas fa-battery-half',
        'installationLocation' => 'fas fa-map-pin',
        'budgetRange' => 'fas fa-coins',
        'timeframe' => 'fas fa-clock',
        
        // Ostatní
        'notes' => 'fas fa-sticky-note',
        'documents' => 'fas fa-file-alt',
        'agreements' => 'fas fa-handshake'
    ];
    
    return $icons[$field] ?? 'fas fa-info-circle';
}

// Kompletní seznam názvů polí podle skutečného formuláře
function getFieldLabel($key) {
    $labels = [
        // Krok 1 - Identifikační údaje zákazníka
        'companyName' => 'Název společnosti / jméno',
        'ico' => 'IČO',
        'dic' => 'DIČ',
        'contactPerson' => 'Kontaktní osoba',
        'email' => 'E-mailová adresa',
        'phone' => 'Telefon',
        'address' => 'Adresa odběrného místa',
        'companyAddress' => 'Adresa sídla firmy',
        'sameAsCompanyAddress' => 'Stejná adresa jako sídlo',
        'customerType' => 'Typ zákazníka',
        'additionalContacts' => 'Dodatečné kontaktní osoby',
        'companyDetails' => 'Detaily společnosti z MERK',
        
        // Typy zákazníků
        'industrial' => '🏭 Průmysl',
        'commercial' => '🏢 Komerční objekt',
        'services' => '🚚 Služby / Logistika',  
        'agriculture' => '🌾 Zemědělství',
        'public' => '🏛️ Veřejný sektor',
        'other' => '❓ Jiný typ',
        
        // Krok 2 - Parametry odběrného místa
        'hasFveVte' => 'Má instalovanou FVE/VTE',
        'fveVtePower' => 'Výkon FVE/VTE (kW)',
        'accumulationPercentage' => 'Procento akumulace přetoků (%)',
        'interestedInFveVte' => 'Zájem o instalaci FVE',
        'interestedInInstallationProcessing' => 'Zájem o zpracování instalace',
        'interestedInElectromobility' => 'Zájem o elektromobilitu',
        
        // Transformátor
        'hasTransformer' => 'Má vlastní trafostanici',
        'transformerPower' => 'Výkon trafostanice (kVA)',
        'transformerVoltage' => 'VN strana napětí',
        'coolingType' => 'Typ chlazení transformátoru',
        'transformerYear' => 'Rok výroby transformátoru',
        'transformerType' => 'Typ transformátoru',
        'transformerCurrent' => 'Proud transformátoru (A)',
        'circuitBreakerType' => 'Typ hlavního jističe',
        'customCircuitBreaker' => 'Vlastní specifikace jističe',
        
        // Sdílení elektřiny
        'sharesElectricity' => 'Sdílí elektřinu s jinými',
        'electricityShared' => 'Množství sdílené elektřiny (kWh/měsíc)',
        'receivesSharedElectricity' => 'Přijímá sdílenou elektřinu',
        'electricityReceived' => 'Množství přijaté elektřiny (kWh/měsíc)',
        'mainCircuitBreaker' => 'Hlavní jistič (A)',
        'reservedPower' => 'Rezervovaný příkon (kW)',
        
        // Krok 3 - Spotřeba a rozložení
        'monthlyConsumption' => 'Měsíční spotřeba (MWh)',
        'monthlyMaxConsumption' => 'Měsíční maximum odběru (kW)',
        'significantConsumption' => 'Významné odběry / technologie',
        'distributionTerritory' => 'Distribuční území',
        'cezTerritory' => 'ČEZ Distribuce',
        'edsTerritory' => 'E.ON Distribuce',
        'preTerritory' => 'PRE Distribuce',
        'ldsName' => 'Lokální distribuční soustava - název',
        'ldsOwner' => 'Vlastník LDS',
        'ldsNotes' => 'Poznámky k LDS',
        'measurementType' => 'Typ měření',
        'measurementTypeOther' => 'Jiný typ měření',
        'yearlyConsumption' => 'Roční spotřeba (MWh)',
        'dailyAverageConsumption' => 'Průměrná denní spotřeba (kWh)',
        'maxConsumption' => 'Maximální odběr (kW)',
        'minConsumption' => 'Minimální odběr (kW)',
        'hasDistributionCurves' => 'Má k dispozici odběrové diagramy',
        'distributionCurvesDetails' => 'Detaily odběrových diagramů',
        'distributionCurvesFile' => 'Soubor s odběrovými křivkami',
        'hasCriticalConsumption' => 'Má kritickou spotřebu',
        'criticalConsumption' => 'Popis kritické spotřeby',
        
        // Provozní doba
        'weekdayStart' => 'Začátek pracovního dne',
        'weekdayEnd' => 'Konec pracovního dne',
        'weekdayConsumption' => 'Spotřeba během pracovního dne',
        'weekendStart' => 'Začátek víkendu',
        'weekendEnd' => 'Konec víkendu', 
        'weekendConsumption' => 'Víkendová spotřeba',
        'weekdayPattern' => 'Vzorec spotřeby během týdne',
        'weekendPattern' => 'Vzorec víkendové spotřeby',
        
        // Krok 4 - Analýza spotřeby a akumulace
        'energyAccumulation' => 'Množství energie k akumulaci',
        'energyAccumulationAmount' => 'Konkrétní hodnota (kWh)',
        'energyAccumulationValue' => 'Konkrétní hodnota akumulace (kWh)',
        'batteryCycles' => 'Kolikrát denně využít baterii',
        'requiresBackup' => 'Potřeba záložního napájení',
        'backupDescription' => 'Co je potřeba zálohovat',
        'backupDuration' => 'Požadovaná doba zálohy',
        'priceOptimization' => 'Řízení podle ceny elektřiny',
        'hasElectricityProblems' => 'Problémy s elektřinou',
        'electricityProblemsDetails' => 'Detaily problémů s elektřinou',
        'hasEnergyAudit' => 'Energetický audit',
        'energyAuditDate' => 'Datum energetického auditu',
        'auditDocuments' => 'Dokumenty energetického auditu',
        'hasOwnEnergySource' => 'Vlastní zdroj energie',
        'ownEnergySourceDetails' => 'Detaily vlastního zdroje',
        'canProvideLoadSchema' => 'Může poskytnout schéma zatížení',
        'loadSchemaDetails' => 'Detaily schématu zatížení',
        
        // Krok 5 - Cíle a optimalizace
        'goals' => 'Hlavní cíle bateriového úložiště',
        'priority1' => 'Priorita č. 1',
        'priority2' => 'Priorita č. 2', 
        'priority3' => 'Priorita č. 3',
        
        // Krok 6 - Místo realizace a infrastruktura
        'hasOutdoorSpace' => 'Venkovní prostory',
        'outdoorSpaceDetails' => 'Detaily venkovních prostor',
        'hasIndoorSpace' => 'Vnitřní prostory',
        'indoorSpaceDetails' => 'Detaily vnitřních prostor',
        'accessibility' => 'Přístupnost lokality',
        'hasProjectDocumentation' => 'Projektová dokumentace',
        'documentationTypes' => 'Typy dostupné dokumentace',
        'projectDocuments' => 'Projektová dokumentace (soubory)',
        'sitePlan' => 'Situační plán areálu',
        'electricalPlan' => 'Elektrická dokumentace',
        'buildingPlan' => 'Půdorysy budov',
        'otherDocumentation' => 'Jiná dokumentace',
        
        // Krok 7 - Připojení k síti a legislativa  
        'gridConnectionPlanned' => 'Připojení k DS/ČEPS',
        'powerIncreaseRequested' => 'Navýšení rezervovaného příkonu',
        'requestedPowerIncrease' => 'Požadované navýšení příkonu (kW)',
        'requestedOutputIncrease' => 'Požadované navýšení výkonu (kW)',
        'connectionApplicationBy' => 'Žádost o připojení podá',
        'willingToSignPowerOfAttorney' => 'Ochoten podepsat plnou moc',
        'hasEnergeticSpecialist' => 'Energetický specialista',
        'specialistPosition' => 'Pozice specialisty',
        'energeticSpecialist' => 'Jméno energetického specialisty',
        'energeticSpecialistContact' => 'Kontakt na specialistu',
        'proposedSteps' => 'Navrhované kroky',
        
        // Krok 8 - Energetická fakturace a bilancování
        'electricityPriceVT' => 'Cena elektřiny VT (Kč/kWh)',
        'electricityPriceNT' => 'Cena elektřiny NT (Kč/kWh)',
        'distributionPriceVT' => 'Distribuce VT (Kč/kWh)',
        'distributionPriceNT' => 'Distribuce NT (Kč/kWh)',
        'systemServices' => 'Systémové služby (Kč/kWh)',
        'ote' => 'OTE (Kč/kWh)',
        'billingFees' => 'Poplatky za vyúčtování (Kč/měsíc)',
        'billingMethod' => 'Způsob vyúčtování',
        'spotSurcharge' => 'Přirážka na spot cenu (Kč/MWh)',
        'fixPrice' => 'Fixní cena elektřiny (Kč/kWh)',
        'fixPercentage' => 'Podíl fix (%)',
        'spotPercentage' => 'Podíl spot (%)',
        'gradualFixPrice' => 'Postupná fixní cena (Kč/kWh)',
        'gradualSpotSurcharge' => 'Postupná spot přirážka (Kč/MWh)',
        'billingDocuments' => 'Doklady o vyúčtování',
        'currentEnergyPrice' => 'Současná cena elektřiny (Kč/kWh)',
        'priceImportance' => 'Důležitost ceny elektřiny',
        'electricitySharing' => 'Sdílení elektřiny',
        'sharingDetails' => 'Detaily sdílení',
        'hasGas' => 'Využití plynu',
        'gasPrice' => 'Cena plynu (Kč/kWh)',
        'gasConsumption' => 'Spotřeba plynu (kWh/rok)',
        'gasUsage' => 'Použití plynu',
        'heating' => 'Vytápění',
        'hotWater' => 'Ohřev vody',
        'technology' => 'Technologie/výroba',
        'cooking' => 'Vaření',
        'hasCogeneration' => 'Kogenerační jednotka',
        'cogenerationDetails' => 'Detaily kogenerační jednotky',
        'cogenerationPhotos' => 'Fotografie kogenerační jednotky',
        'hotWaterConsumption' => 'Spotřeba teplé vody (l/den)',
        'heatingConsumption' => 'Spotřeba tepla (kWh/rok)',
        'coolingConsumption' => 'Spotřeba chladu (kWh/rok)',
        'otherConsumption' => 'Další spotřeby',
        
        // Poznámky a soubory
        'notes' => 'Poznámky',
        'stepNotes' => 'Poznámky ke kroku',
        'fileUploads' => 'Nahraté soubory',
        'budgetMin' => 'Minimální rozpočet',
        'budgetMax' => 'Maximální rozpočet',
        'timeframeStart' => 'Začátek realizace',
        'timeframeEnd' => 'Konec realizace'
    ];
    
    return $labels[$key] ?? ucfirst(str_replace(['_', 'Type', 'Has', 'Is'], [' ', ' typ', 'Má ', 'Je '], $key));
}

// Funkce pro formatování hodnot s českými překlady
function formatFieldValue($key, $value) {
    // Prázdné hodnoty
    if (is_null($value) || $value === '' || $value === false || (is_array($value) && empty($value))) {
        return '<span class="text-gray-400 italic flex items-center"><i class="fas fa-minus-circle mr-1"></i>Nevyplněno</span>';
    }
    
    // České překlady podle FormSummary.jsx
    $translations = [
        // Základní yes/no
        'yes' => 'Ano',
        'no' => 'Ne',
        'true' => 'Ano',
        'false' => 'Ne',
        '1' => 'Ano',
        '0' => 'Ne',
        
        // Distribuční území
        'cez' => 'ČEZ',
        'pre' => 'PRE', 
        'egd' => 'E.GD',
        'lds' => 'LDS',
        
        // Typy jističe
        'oil' => 'Olejový spínač',
        'vacuum' => 'Vakuový spínač',
        'SF6' => 'SF6 spínač',
        'other' => 'Jiný typ',
        'custom' => 'Vlastní specifikace',
        
        // Napětí transformátoru
        '22kV' => '22kV',
        '35kV' => '35kV', 
        '110kV' => '110kV',
        
        // Chlazení transformátoru
        'ONAN' => 'ONAN',
        'ONAF' => 'ONAF',
        
        // Typ měření
        'quarter-hour' => 'Čtvrthodinové měření (A-měření)',
        
        // Akumulace energie
        'unknown' => 'Neví',
        'specific' => 'Konkrétní hodnota',
        
        // Cykly baterie
        'once' => '1x denně',
        'multiple' => 'Vícekrát denně',
        'recommend' => 'Neznámo - doporučit',
        
        // Doba zálohy
        'minutes' => 'Desítky minut',
        'hours-1-3' => '1-3 hodiny',
        'hours-3-plus' => 'Více než 3 hodiny',
        
        // Přístupnost
        'unlimited' => 'Bez omezení',
        'limited' => 'Omezený',
        
        // Způsob vyúčtování elektřiny
        'spot' => 'Spotová cena',
        'fix' => 'Fixní cena',
        'combined' => 'Kombinace fix/spot',
        'gradual' => 'Postupná fixace',
        
        // Žádost o připojení - kdo podá
        'customer' => 'Zákazník sám',
        'electree' => 'Firma Electree na základě plné moci',
        'undecided' => 'Ještě nerozhodnuto',
        
        // Pozice energetického specialisty
        'specialist' => 'Specialista',
        'manager' => 'Správce',
        
        // Důležitost ceny
        'very-important' => 'Velmi důležitá',
        'important' => 'Důležitá',
        'neutral' => 'Neutrální',
        'less-important' => 'Méně důležitá',
        'not-important' => 'Nedůležitá'
    ];
    
    // Použití překladu pokud existuje
    if (isset($translations[strtolower($value)])) {
        $translatedValue = $translations[strtolower($value)];
        if (in_array($translatedValue, ['Ano', 'Ne'])) {
            return $translatedValue === 'Ano' ? 
                '<span class="text-emerald-600 font-medium flex items-center"><i class="fas fa-check-circle mr-1"></i>Ano</span>' : 
                '<span class="text-red-600 font-medium flex items-center"><i class="fas fa-times-circle mr-1"></i>Ne</span>';
        }
        return '<span class="font-medium text-blue-600">' . htmlspecialchars($translatedValue) . '</span>';
    }
    
    // Pole s daty
    if (is_array($value)) {
        // Pro pole typu zákazníka
        if (strpos($key, 'customerType') !== false) {
            $types = [];
            foreach ($value as $type => $selected) {
                if ($selected) {
                    $type_labels = [
                        'industrial' => '🏭 Průmysl',
                        'commercial' => '🏢 Komerční objekt', 
                        'services' => '🚚 Služby / Logistika',
                        'agriculture' => '🌾 Zemědělství',
                        'public' => '🏛️ Veřejný sektor',
                        'other' => '❓ Jiný'
                    ];
                    $types[] = $type_labels[$type] ?? ucfirst($type);
                }
            }
            return !empty($types) ? '<div class="flex flex-wrap gap-1">' . implode('</div><div class="bg-blue-100 px-2 py-1 rounded text-sm">', $types) . '</div>' : '<span class="text-gray-400 italic">Nevyplněno</span>';
        }
        
        // Pro výběr cílů
        if (strpos($key, 'goals') !== false || strpos($key, 'Goals') !== false) {
            $goals = [];
            foreach ($value as $goalKey => $selected) {
                if ($selected) {
                    $goal_labels = [
                        'energyIndependence' => 'Energetická nezávislost',
                        'costSaving' => 'Úspora nákladů',
                        'backupPower' => 'Záložní napájení',
                        'peakShaving' => 'Peak shaving',
                        'gridStabilization' => 'Stabilizace sítě',
                        'environmentalBenefit' => 'Ekologický přínos',
                        'other' => 'Jiné'
                    ];
                    $goals[] = $goal_labels[$goalKey] ?? ucfirst(str_replace('_', ' ', $goalKey));
                }
            }
            return !empty($goals) ? '<div class="space-y-1">' . implode('</div><div class="text-sm bg-green-50 px-2 py-1 rounded">', $goals) . '</div>' : '<span class="text-gray-400 italic">Nevyplněno</span>';
        }
        
        // Pro priority
        if (strpos($key, 'priority') !== false && is_string($value)) {
            $priority_labels = [
                'fve-overflow' => 'Úspora z přetoků z FVE',
                'peak-shaving' => 'Posun spotřeby (peak shaving)',
                'backup-power' => 'Záložní napájení',
                'grid-services' => 'Služby pro síť',
                'cost-optimization' => 'Optimalizace nákladů na elektřinu',
                'environmental' => 'Ekologický přínos',
                'machine-support' => 'Podpora výkonu strojů',
                'power-reduction' => 'Snížení rezervovaného příkonu',
                'energy-trading' => 'Možnost obchodování s energií',
                'subsidy' => 'Získání dotace',
                'other' => 'Jiný účel'
            ];
            $priority_text = $priority_labels[$value] ?? $value;
            return '<div class="bg-orange-100 px-3 py-2 rounded-lg text-orange-800 font-medium">' . htmlspecialchars($priority_text) . '</div>';
        }
        
        // Pro použití plynu
        if (strpos($key, 'gasUsage') !== false) {
            $usages = [];
            foreach ($value as $usage => $selected) {
                if ($selected) {
                    $usage_labels = [
                        'heating' => 'Vytápění',
                        'hotWater' => 'Ohřev vody',
                        'technology' => 'Technologie/výroba',
                        'cooking' => 'Vaření'
                    ];
                    $usages[] = $usage_labels[$usage] ?? ucfirst($usage);
                }
            }
            return !empty($usages) ? '<div class="space-y-1">' . implode('</div><div class="text-sm bg-yellow-50 px-2 py-1 rounded">', $usages) . '</div>' : '<span class="text-gray-400 italic">Nevyplněno</span>';
        }
        
        // Pro obecná pole
        $formatted = [];
        foreach ($value as $k => $v) {
            if ($v && $v !== false && $v !== '') {
                $formatted[] = is_string($k) ? "$k: $v" : $v;
            }
        }
        return !empty($formatted) ? 
            '<div class="bg-gray-100 rounded p-2 text-sm max-w-lg">' . implode('<br>', array_map('htmlspecialchars', $formatted)) . '</div>' :
            '<span class="text-gray-400 italic">Nevyplněno</span>';
    }
    
    // Telefonní čísla
    if (strpos($key, 'phone') !== false || strpos($key, 'Phone') !== false) {
        return '<a href="tel:' . htmlspecialchars($value) . '" class="text-blue-600 hover:underline flex items-center">
                    <i class="fas fa-phone mr-1"></i>' . htmlspecialchars($value) . '</a>';
    }
    
    // Emailové adresy
    if (strpos($key, 'email') !== false || strpos($key, 'Email') !== false) {
        return '<a href="mailto:' . htmlspecialchars($value) . '" class="text-blue-600 hover:underline flex items-center">
                    <i class="fas fa-envelope mr-1"></i>' . htmlspecialchars($value) . '</a>';
    }
    
    // Adresy
    if (strpos($key, 'address') !== false || strpos($key, 'Address') !== false) {
        return '<div class="flex items-start max-w-sm">
                    <i class="fas fa-map-marker-alt text-red-500 mr-2 mt-1 flex-shrink-0"></i>
                    <span class="text-gray-900">' . htmlspecialchars($value) . '</span>
                </div>';
    }
    
    // Číselné hodnoty s jednotkami
    if (strpos($key, 'Power') !== false || strpos($key, 'power') !== false) {
        return '<span class="font-medium text-blue-600">' . number_format((float)$value, 0, ',', ' ') . '</span> <span class="text-gray-500 text-sm">kW</span>';
    }
    
    if (strpos($key, 'Consumption') !== false || strpos($key, 'consumption') !== false) {
        return '<span class="font-medium text-green-600">' . number_format((float)$value, 0, ',', ' ') . '</span> <span class="text-gray-500 text-sm">kWh</span>';
    }
    
    // Dlouhé texty
    if (strlen($value) > 100 || strpos($key, 'note') !== false || strpos($key, 'description') !== false || strpos($key, 'detail') !== false) {
        return '<div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded max-w-2xl">
                    <div class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">' . htmlspecialchars($value) . '</div>
                </div>';
    }
    
    // Číselné hodnoty
    if (is_numeric($value)) {
        return '<span class="font-medium text-blue-600">' . number_format((float)$value, 0, ',', ' ') . '</span>';
    }
    
    // Výchozí formátování
    return '<span class="text-gray-900">' . htmlspecialchars($value) . '</span>';
}

// Status funkce
function getStatusClass($status) {
    switch($status) {
        case 'draft': return 'bg-yellow-100 text-yellow-800';
        case 'submitted': return 'bg-green-100 text-green-800';
        case 'processing': return 'bg-blue-100 text-blue-800';
        case 'completed': return 'bg-emerald-100 text-emerald-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function getStatusLabel($status) {
    switch($status) {
        case 'draft': return 'Rozpracovaný';
        case 'submitted': return 'Odeslaný';
        case 'processing': return 'Zpracovává se';
        case 'completed': return 'Dokončený';
        case 'cancelled': return 'Zrušený';
        default: return ucfirst($status);
    }
}

// Organizace dat podle kroků
function organizeDataBySteps($decoded_data) {
    $steps = [
        1 => ['companyName', 'ico', 'dic', 'contactPerson', 'email', 'phone', 'address', 'companyAddress', 'sameAsCompanyAddress', 'customerType', 'additionalContacts', 'companyDetails'],
        2 => ['hasFveVte', 'fveVtePower', 'accumulationPercentage', 'interestedInFveVte', 'interestedInInstallationProcessing', 'interestedInElectromobility', 'hasTransformer', 'transformerPower', 'transformerVoltage', 'coolingType', 'transformerYear', 'transformerType', 'transformerCurrent', 'circuitBreakerType', 'customCircuitBreaker', 'sharesElectricity', 'electricityShared', 'receivesSharedElectricity', 'electricityReceived', 'mainCircuitBreaker', 'reservedPower'],
        3 => ['monthlyConsumption', 'monthlyMaxConsumption', 'significantConsumption', 'distributionTerritory', 'cezTerritory', 'edsTerritory', 'preTerritory', 'ldsName', 'ldsOwner', 'ldsNotes', 'measurementType', 'measurementTypeOther', 'yearlyConsumption', 'dailyAverageConsumption', 'maxConsumption', 'minConsumption', 'hasDistributionCurves', 'distributionCurvesDetails', 'distributionCurvesFile', 'hasCriticalConsumption', 'criticalConsumption', 'weekdayStart', 'weekdayEnd', 'weekdayConsumption', 'weekendStart', 'weekendEnd', 'weekendConsumption', 'weekdayPattern', 'weekendPattern'],
        4 => ['energyAccumulation', 'energyAccumulationAmount', 'energyAccumulationValue', 'batteryCycles', 'requiresBackup', 'backupDescription', 'backupDuration', 'priceOptimization', 'hasElectricityProblems', 'electricityProblemsDetails', 'hasEnergyAudit', 'energyAuditDate', 'auditDocuments', 'hasOwnEnergySource', 'ownEnergySourceDetails', 'canProvideLoadSchema', 'loadSchemaDetails'],
        5 => ['goals', 'priority1', 'priority2', 'priority3'],
        6 => ['hasOutdoorSpace', 'outdoorSpaceDetails', 'hasIndoorSpace', 'indoorSpaceDetails', 'accessibility', 'hasProjectDocumentation', 'documentationTypes', 'projectDocuments', 'sitePlan', 'electricalPlan', 'buildingPlan', 'otherDocumentation'],
        7 => ['gridConnectionPlanned', 'powerIncreaseRequested', 'requestedPowerIncrease', 'requestedOutputIncrease', 'connectionApplicationBy', 'willingToSignPowerOfAttorney', 'hasEnergeticSpecialist', 'specialistPosition', 'energeticSpecialist', 'energeticSpecialistContact', 'proposedSteps'],
        8 => ['electricityPriceVT', 'electricityPriceNT', 'distributionPriceVT', 'distributionPriceNT', 'systemServices', 'ote', 'billingFees', 'billingMethod', 'spotSurcharge', 'fixPrice', 'fixPercentage', 'spotPercentage', 'gradualFixPrice', 'gradualSpotSurcharge', 'billingDocuments', 'currentEnergyPrice', 'priceImportance', 'electricitySharing', 'sharingDetails', 'hasGas', 'gasPrice', 'gasConsumption', 'gasUsage', 'heating', 'hotWater', 'technology', 'cooking', 'hasCogeneration', 'cogenerationDetails', 'cogenerationPhotos', 'hotWaterConsumption', 'heatingConsumption', 'coolingConsumption', 'otherConsumption']
    ];
    
    $organized_data = [];
    foreach ($steps as $step_num => $fields) {
        foreach ($fields as $field) {
            if (isset($decoded_data[$field])) {
                $organized_data[$step_num][$field] = $decoded_data[$field];
            }
        }
    }
    
    return $organized_data;
}

$organized_data = organizeDataBySteps($decoded_data);
?>

<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detail formuláře - Electree Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'electree-green': '#22c55e',
                        'electree-blue': '#3b82f6',
                    }
                }
            }
        }
    </script>
    <style>
        .step-card {
            transition: all 0.3s ease;
        }
        .step-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
    </style>
</head>
<body class="bg-gray-100 min-h-screen">
    <!-- Header -->
    <div class="gradient-bg text-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between py-6">
                <div>
                    <a href="admin-forms.php" class="inline-flex items-center text-white hover:text-gray-200 transition-colors">
                        <i class="fas fa-arrow-left mr-2"></i>
                        Zpět na seznam formulářů
                    </a>
                </div>
                <div class="text-right">
                    <h1 class="text-2xl font-bold">Detail formuláře</h1>
                    <p class="text-white/80">ID: <?= htmlspecialchars($form_data['id']) ?></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Form Info Card -->
        <div class="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 class="text-2xl font-bold mb-2"><?= htmlspecialchars($decoded_data['companyName'] ?? 'Bez názvu') ?></h2>
                        <div class="flex items-center space-x-4 text-blue-100">
                            <span><i class="fas fa-calendar mr-1"></i><?= date('d.m.Y H:i', strtotime($form_data['created_at'])) ?></span>
                            <span><i class="fas fa-user mr-1"></i><?= htmlspecialchars($decoded_data['contactPerson'] ?? 'Neznámý') ?></span>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium <?= getStatusClass($form_data['status']) ?>">
                            <i class="fas fa-circle mr-2 text-xs"></i>
                            <?= getStatusLabel($form_data['status']) ?>
                        </span>
                    </div>
                </div>
            </div>
            
            <!-- Quick Stats -->
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-blue-600"><?= count(array_filter($organized_data)) ?></div>
                        <div class="text-sm text-gray-500">Vyplněných kroků</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-green-600"><?= htmlspecialchars($decoded_data['monthlyConsumption'] ?? '0') ?></div>
                        <div class="text-sm text-gray-500">MWh/měsíc</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-orange-600"><?= htmlspecialchars($decoded_data['reservedPower'] ?? '0') ?></div>
                        <div class="text-sm text-gray-500">kW rezervované</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-purple-600"><?= htmlspecialchars($decoded_data['fveVtePower'] ?? '0') ?></div>
                        <div class="text-sm text-gray-500">kW FVE/VTE</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Steps -->
        <div class="space-y-8">
            <?php foreach ($step_names as $step_num => $step_name): ?>
                <?php if (isset($organized_data[$step_num]) && !empty($organized_data[$step_num])): ?>
                <div class="step-card bg-white rounded-xl shadow-md overflow-hidden">
                    <div class="bg-gradient-to-r <?= getStepGradient($step_num) ?> p-6 text-white">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                    <i class="<?= getStepIcon($step_num) ?> text-2xl"></i>
                                </div>
                            </div>
                            <div class="ml-6">
                                <div class="text-sm opacity-80">Krok <?= $step_num ?></div>
                                <h3 class="text-2xl font-bold"><?= $step_name ?></h3>
                                <div class="text-sm opacity-90 mt-1">
                                    <?= count($organized_data[$step_num]) ?> vyplněných polí
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="p-6">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <?php foreach ($organized_data[$step_num] as $key => $value): ?>
                                <div class="border-l-4 border-gray-200 hover:border-blue-400 pl-4 py-2 transition-colors">
                                    <div class="flex items-start space-x-3">
                                        <i class="<?= getFieldIcon($key) ?> text-gray-400 mt-1 flex-shrink-0"></i>
                                        <div class="flex-1 min-w-0">
                                            <dt class="text-sm font-medium text-gray-600 mb-1">
                                                <?= getFieldLabel($key) ?>
                                            </dt>
                                            <dd class="text-sm text-gray-900">
                                                <?= formatFieldValue($key, $value) ?>
                                            </dd>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                        
                        <!-- Step Notes -->
                        <?php if (isset($step_notes[$step_num]) && !empty(trim($step_notes[$step_num]))): ?>
                        <div class="mt-6 pt-6 border-t border-gray-200">
                            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                                <div class="flex">
                                    <i class="fas fa-sticky-note text-yellow-400 mt-1 mr-3 flex-shrink-0"></i>
                                    <div>
                                        <h4 class="text-sm font-medium text-yellow-800 mb-1">Poznámky ke kroku</h4>
                                        <p class="text-sm text-yellow-700 whitespace-pre-wrap"><?= htmlspecialchars($step_notes[$step_num]) ?></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <?php endif; ?>
                    </div>
                </div>
                <?php endif; ?>
            <?php endforeach; ?>
        </div>

        <!-- Actions -->
        <div class="mt-12 flex justify-center space-x-4">
            <a href="admin-forms.php" class="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                <i class="fas fa-arrow-left mr-2"></i>
                Zpět na seznam
            </a>
            <button onclick="window.print()" class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors">
                <i class="fas fa-print mr-2"></i>
                Vytisknout
            </button>
            <a href="mailto:<?= htmlspecialchars($decoded_data['email'] ?? '') ?>?subject=Váš dotazník - Electree" class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-colors">
                <i class="fas fa-envelope mr-2"></i>
                Kontaktovat zákazníka
            </a>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white mt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="text-center">
                <p class="text-gray-400">&copy; 2024 Electree. Všechna práva vyhrazena.</p>
            </div>
        </div>
    </footer>
</body>
</html>
