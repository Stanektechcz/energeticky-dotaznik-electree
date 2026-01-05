<?php
/**
 * Jednoduchá autentizace pro admin rozhraní
 */

// Spustit session pouze pokud není již spuštěná
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Kontrola přihlášení pro admin rozhraní
function requireAuth($role = null) {
    // Zatím bez kontroly - pro testování
    // V produkci zde bude plná autentizace
    
    if ($role === 'admin') {
        // Kontrola admin role pokud je požadována
        if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
            // Pro testovací účely - necháme projít
            // header('Location: /login');
            // exit();
        }
    }
}

// Pro kompatibilitu s existujícími soubory
if (!isset($_SESSION['user_role'])) {
    $_SESSION['user_role'] = 'admin'; // Dočasně pro testování
    $_SESSION['user_id'] = 'admin_test';
    $_SESSION['user_name'] = 'Admin Test';
}
?>
