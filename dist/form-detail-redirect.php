<?php
session_start();

// Kontrola oprávnění
if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    header('Location: /');
    exit();
}

// Přesměrování na nový enhanced admin detail
$query_string = $_SERVER['QUERY_STRING'] ? '?' . $_SERVER['QUERY_STRING'] : '';
header('Location: /enhanced-admin-form-detail.php' . $query_string);
exit();
?>
