<?php
// Přesměrování na opravenou verzi s aktualizovanými mapováními
$form_id = $_GET['id'] ?? null;
if ($form_id) {
    header("Location: enhanced-admin-form-detail-modern-fixed.php?id=" . urlencode($form_id));
    exit();
} else {
    echo "ID formuláře nebylo poskytnuto";
    exit();
}
?>
