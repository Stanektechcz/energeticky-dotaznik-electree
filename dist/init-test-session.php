<?php
// Test script pro nový enhanced admin detail
session_start();

// Simulace admin přihlášení pro test
$_SESSION['user_role'] = 'admin';
$_SESSION['user_id'] = 1;

// Test data pro demo formuláře
$_SESSION['test_forms'] = [
    '1' => [
        'id' => '1',
        'user_name' => 'Jan Novák',
        'user_email' => 'jan.novak@example.com',
        'status' => 'completed',
        'form_data' => json_encode([
            'step1' => [
                'companyName' => 'Testovací firma s.r.o.',
                'ico' => '12345678',
                'dic' => 'CZ12345678',
                'contactPerson' => 'Jan Novák',
                'email' => 'info@testfirma.cz',
                'phone' => '+420 123 456 789',
                'companyAddress' => 'Testovací ulice 123, 100 00 Praha 1'
            ],
            'step2' => [
                'customerType' => ['commercial' => true],
                'hasFveVte' => 'yes',
                'fveVtePower' => '250',
                'hasTransformer' => 'no',
                'monthlyConsumption' => '25000'
            ],
            'step3' => [
                'energyGoals' => ['reduce_costs' => true, 'green_energy' => true],
                'batteryCapacity' => '500',
                'timeframe' => '3 months'
            ],
            'stepNotes' => [
                1 => 'Kontakt navázán prostřednictvím webového formuláře. Zákazník projevil zájem o kompletní energetické řešení pro svůj objekt.',
                2 => 'Stávající fotovoltaická elektrárna o výkonu 250 kW je v provozu 2 roky. Měsíční spotřeba kolísá podle sezóny.',
                3 => 'Prioritní jsou úspory nákladů a podpora udržitelné energie. Zákazník má zájem o bateriové úložiště.'
            ]
        ]),
        'created_at' => '2024-01-15 14:30:00',
        'updated_at' => '2024-01-15 16:45:00'
    ],
    'demo' => [
        'id' => 'demo',
        'user_name' => 'Demo Admin',
        'user_email' => 'admin@electree.cz',
        'status' => 'completed',
        'form_data' => json_encode([
            'step1' => [
                'companyName' => 'Alza.cz a.s.',
                'ico' => '27082440',
                'dic' => 'CZ27082440',
                'contactPerson' => 'Tomáš Cupr',
                'email' => 'tomas.cupr@alza.cz',
                'phone' => '+420 224 842 000',
                'companyAddress' => 'Jankovcova 1522/53, 170 00 Praha 7'
            ],
            'step2' => [
                'customerType' => ['commercial' => true, 'industrial' => true],
                'hasFveVte' => 'yes',
                'fveVtePower' => '1500',
                'hasTransformer' => 'yes',
                'monthlyConsumption' => '150000'
            ],
            'step3' => [
                'energyGoals' => [
                    'reduce_costs' => true, 
                    'backup_power' => true, 
                    'energy_independence' => true,
                    'green_energy' => true
                ],
                'batteryCapacity' => '2500',
                'timeframe' => '12 months'
            ],
            'step4' => [
                'businessContinuity' => 'critical',
                'peakShaving' => 'yes',
                'loadBalancing' => 'yes'
            ],
            'stepNotes' => [
                1 => 'Velká e-commerce společnost s významnou spotřebou. Kontakt navázán prostřednictvím obchodního zástupce.',
                2 => 'Komplexní energetická infrastruktura s vlastní fotovoltaikou. Vysoká spotřeba vyžaduje pokročilé řešení.',
                3 => 'Všechny energetické cíle jsou prioritní. Zákazník má zájem o nejmodernější technologie a dlouhodobou spolupráci.',
                4 => 'Kritická povaha provozu vyžaduje maximální spolehlivost záložního napájení.'
            ]
        ]),
        'created_at' => '2024-01-20 10:00:00',
        'updated_at' => '2024-01-20 11:30:00'
    ]
];

echo "Test session nastaven - admin práva aktivní.\n";
echo "Testovací formuláře vytvořeny.\n";
echo "\nDostupné testovací odkazy:\n";
echo "- /form-detail.php?id=1 (základní test)\n";
echo "- /form-detail.php?id=demo (s MERK API)\n";
echo "- /form-detail.php?id=debug&debug=1 (debug režim)\n";
echo "- /test-enhanced-admin-detail.html (testovací stránka)\n";
?>
