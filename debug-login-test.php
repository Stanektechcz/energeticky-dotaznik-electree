<?php
// WORKING AUTH TEST - zkouška jiného souboru
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

echo json_encode([
    'success' => true,
    'message' => 'WORKING! This is debug-login-test.php',
    'timestamp' => date('Y-m-d H:i:s'),
    'method' => $_SERVER['REQUEST_METHOD'] ?? 'unknown',
    'file' => 'debug-login-test.php'
]);
exit;
    // Zkusíme automatické přesměrování na debug URL
    $currentUrl = $_SERVER['REQUEST_URI'];
    if (strpos($currentUrl, '?debug=electree2025') === false) {
        $debugUrl = $currentUrl . (strpos($currentUrl, '?') === false ? '?' : '&') . 'debug=electree2025';
        header("Location: $debugUrl");
        exit;
    }
}

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Debug Login Test - Electree</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; }
        .debug-panel { background: white; border: 1px solid #dee2e6; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .success { background: #d4edda; border-color: #c3e6cb; color: #155724; }
        .error { background: #f8d7da; border-color: #f5c6cb; color: #721c24; }
        .info { background: #d1ecf1; border-color: #bee5eb; color: #0c5460; }
        .warning { background: #fff3cd; border-color: #ffeaa7; color: #856404; }
        pre { background: #f8f9fa; border: 1px solid #e9ecef; padding: 15px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; font-size: 12px; }
        button { padding: 12px 24px; margin: 8px; background: #007bff; color: white; border: none; cursor: pointer; border-radius: 5px; font-size: 14px; }
        button:hover { background: #0056b3; }
        button.danger { background: #dc3545; }
        button.danger:hover { background: #c82333; }
        button.success { background: #28a745; }
        button.success:hover { background: #218838; }
        .step { margin: 8px 0; padding: 10px; background: #f8f9fa; border-left: 4px solid #007bff; border-radius: 0 5px 5px 0; }
        .step.error { border-left-color: #dc3545; background: #f8d7da; }
        .step.success { border-left-color: #28a745; background: #d4edda; }
        .step.warning { border-left-color: #ffc107; background: #fff3cd; }
        .timestamp { color: #6c757d; font-size: 12px; font-weight: normal; }
        .header { text-align: center; background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 30px; margin: -20px -20px 20px -20px; border-radius: 8px 8px 0 0; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat-card { background: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; }
        .stat-number { font-size: 24px; font-weight: bold; color: #007bff; }
        .loading { display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="container">
        <div class="debug-panel">
            <div class="header">
                <h1>🔍 Debug Login Test</h1>
                <p>Electree - ed.electree.cz</p>
                <div class="timestamp">Test spuštěn: <?= date('d.m.Y H:i:s') ?></div>
            </div>

            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number" id="testCount">0</div>
                    <div>Celkem testů</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="successCount">0</div>
                    <div>Úspěšných</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="errorCount">0</div>
                    <div>Chyb</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="responseTime">-</div>
                    <div>Avg. odezva (ms)</div>
                </div>
            </div>

            <div>
                <h3>🎮 Test Controls</h3>
                <button onclick="runQuickTest()" class="success">⚡ Rychlý test</button>
                <button onclick="runFullTest()">🧪 Kompletní test</button>
                <button onclick="testDatabase()">🗄️ Test databáze</button>
                <button onclick="testLogin('admin', 'admin123')">👤 Test Admin</button>
                <button onclick="testLogin('wronguser', 'wrongpass')" class="danger">❌ Test Wrong Login</button>
                <button onclick="clearResults()">🗑️ Vymazat</button>
            </div>
        </div>

        <div id="results"></div>
    </div>

    <script>
        let testStats = {
            total: 0,
            success: 0,
            error: 0,
            responseTimes: []
        };

        function updateStats() {
            document.getElementById('testCount').textContent = testStats.total;
            document.getElementById('successCount').textContent = testStats.success;
            document.getElementById('errorCount').textContent = testStats.error;
            
            if (testStats.responseTimes.length > 0) {
                const avg = testStats.responseTimes.reduce((a, b) => a + b, 0) / testStats.responseTimes.length;
                document.getElementById('responseTime').textContent = Math.round(avg);
            }
        }

        function addResult(title, content, type = 'info') {
            const results = document.getElementById('results');
            const panel = document.createElement('div');
            panel.className = `debug-panel ${type}`;
            panel.innerHTML = `
                <h3>${title}</h3>
                <div class="timestamp">⏰ ${new Date().toLocaleString('cs-CZ')}</div>
                ${content}
            `;
            results.appendChild(panel);
            panel.scrollIntoView({ behavior: 'smooth' });
            
            testStats.total++;
            if (type === 'success') testStats.success++;
            if (type === 'error') testStats.error++;
            updateStats();
        }

        function clearResults() {
            document.getElementById('results').innerHTML = '';
            testStats = { total: 0, success: 0, error: 0, responseTimes: [] };
            updateStats();
        }

        async function runQuickTest() {
            addResult('⚡ Rychlý test spuštěn', '<div class="loading"></div> Testuji základní funkčnost...', 'info');
            
            // Test 1: Auth.php dostupnost
            try {
                const startTime = performance.now();
                const response = await fetch('./auth.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'debug' })
                });
                const endTime = performance.now();
                const responseTime = Math.round(endTime - startTime);
                testStats.responseTimes.push(responseTime);
                
                const text = await response.text();
                
                if (text.trim() === '') {
                    addResult('❌ KRITICKÁ CHYBA', `
                        <p><strong>Auth.php vrací prázdnou odpověď!</strong></p>
                        <p>Response time: ${responseTime}ms</p>
                        <p>Status: ${response.status}</p>
                        <p>Toto je hlavní problém - server nevrací žádný obsah.</p>
                    `, 'error');
                } else {
                    try {
                        const data = JSON.parse(text);
                        addResult('✅ Rychlý test úspěšný', `
                            <p>Auth.php funguje a vrací validní JSON!</p>
                            <p>Response time: ${responseTime}ms</p>
                            <p>Response length: ${text.length} znaků</p>
                            <pre>${JSON.stringify(data, null, 2)}</pre>
                        `, 'success');
                    } catch (jsonError) {
                        addResult('⚠️ JSON Parse Error', `
                            <p>Auth.php odpověděl, ale JSON není validní</p>
                            <p>Response time: ${responseTime}ms</p>
                            <p>Error: ${jsonError.message}</p>
                            <p>Raw response:</p>
                            <pre>${text.substring(0, 500)}${text.length > 500 ? '...' : ''}</pre>
                        `, 'warning');
                    }
                }
            } catch (error) {
                addResult('❌ Network Error', `
                    <p>Nepodařilo se kontaktovat auth.php</p>
                    <p>Error: ${error.message}</p>
                `, 'error');
            }
        }

        async function testDatabase() {
            addResult('🗄️ Test databáze', '<div class="loading"></div> Testuji databázové připojení...', 'info');
            
            try {
                const response = await fetch('./auth.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'debug' })
                });
                
                const text = await response.text();
                const data = JSON.parse(text);
                
                if (data.debug && data.debug.database) {
                    const db = data.debug.database;
                    if (db.connection === 'OK') {
                        addResult('✅ Databáze OK', `
                            <p>Připojení k databázi funguje!</p>
                            <p>Connection time: ${db.connection_time_ms}ms</p>
                            <p>Host: ${db.host}</p>
                            <p>Database: ${db.database}</p>
                            <p>Users table exists: ${data.debug.users_table_exists ? 'ANO' : 'NE'}</p>
                            ${data.debug.users_count ? `<p>Users count: ${data.debug.users_count}</p>` : ''}
                        `, 'success');
                    } else {
                        addResult('❌ Databáze ERROR', `
                            <p>Chyba databáze: ${db.error}</p>
                            <p>Kód: ${db.code}</p>
                        `, 'error');
                    }
                } else {
                    addResult('⚠️ Databáze test neúplný', `
                        <p>Debug endpoint nevrátil databázové informace</p>
                        <pre>${JSON.stringify(data.debug, null, 2)}</pre>
                    `, 'warning');
                }
            } catch (error) {
                addResult('❌ Database Test Failed', `<p>Error: ${error.message}</p>`, 'error');
            }
        }

        async function testLogin(username, password) {
            addResult(`🔐 Test přihlášení: ${username}`, '<div class="loading"></div> Přihlašuji...', 'info');
            
            try {
                const startTime = performance.now();
                const response = await fetch('./auth.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'login',
                        nickname: username,
                        password: password
                    })
                });
                const endTime = performance.now();
                const responseTime = Math.round(endTime - startTime);
                testStats.responseTimes.push(responseTime);
                
                const responseText = await response.text();
                
                if (responseText.trim() === '') {
                    addResult('❌ PRÁZDNÁ ODPOVĚĎ', `
                        <p><strong>Server vrací prázdnou odpověď!</strong></p>
                        <p>Response time: ${responseTime}ms</p>
                        <p>Status: ${response.status}</p>
                        <p>Toto je hlavní problém vašeho loginu.</p>
                    `, 'error');
                    return;
                }
                
                try {
                    const result = JSON.parse(responseText);
                    
                    if (result.success) {
                        let debugInfo = '';
                        if (result.debug) {
                            debugInfo = '<h4>📋 Server Debug Log:</h4><ul>';
                            result.debug.forEach(log => {
                                debugInfo += `<li>${log}</li>`;
                            });
                            debugInfo += '</ul>';
                        }
                        
                        addResult('✅ Přihlášení úspěšné', `
                            <p><strong>Uživatel:</strong> ${result.user.name}</p>
                            <p><strong>Role:</strong> ${result.user.role}</p>
                            <p><strong>Email:</strong> ${result.user.email}</p>
                            <p><strong>Response time:</strong> ${responseTime}ms</p>
                            ${debugInfo}
                        `, 'success');
                    } else {
                        let debugInfo = '';
                        if (result.debug) {
                            debugInfo = '<h4>📋 Server Debug Log:</h4><ul>';
                            result.debug.forEach(log => {
                                debugInfo += `<li>${log}</li>`;
                            });
                            debugInfo += '</ul>';
                        }
                        
                        addResult('❌ Přihlášení selhalo', `
                            <p><strong>Chyba:</strong> ${result.error}</p>
                            <p><strong>Response time:</strong> ${responseTime}ms</p>
                            <p><strong>Error type:</strong> ${result.error_type || 'N/A'}</p>
                            ${debugInfo}
                        `, 'error');
                    }
                    
                } catch (jsonError) {
                    addResult('❌ JSON Parse Error', `
                        <p>Server odpověděl, ale JSON není validní</p>
                        <p>Response time: ${responseTime}ms</p>
                        <p>Error: ${jsonError.message}</p>
                        <h4>Raw Response (první 1000 znaků):</h4>
                        <pre>${responseText.substring(0, 1000)}${responseText.length > 1000 ? '...' : ''}</pre>
                    `, 'error');
                }
                
            } catch (error) {
                addResult('❌ Request Failed', `<p>Error: ${error.message}</p>`, 'error');
            }
        }

        async function runFullTest() {
            clearResults();
            addResult('🧪 Kompletní test', 'Spouštím sérii testů...', 'info');
            
            await new Promise(resolve => setTimeout(resolve, 500));
            await runQuickTest();
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            await testDatabase();
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            await testLogin('admin', 'admin123');
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            await testLogin('admin', 'wrongpassword');
            
            addResult('🏁 Kompletní test dokončen', `
                <p>Všechny testy proběhly.</p>
                <div class="stats" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px;">
                    <div>Celkem: <strong>${testStats.total}</strong></div>
                    <div>Úspěch: <strong>${testStats.success}</strong></div>
                    <div>Chyby: <strong>${testStats.error}</strong></div>
                </div>
            `, 'info');
        }

        // Auto-run quick test on page load
        setTimeout(runQuickTest, 1000);
    </script>
</body>
</html>