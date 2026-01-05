<?php
// Immediate file upload handler for battery form - simplified version
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Metoda není povolena']);
    exit;
}

try {
    // Create uploads directory in public folder if it doesn't exist
    $uploadDir = 'public/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Get form ID and field name from POST data
    $formId = $_POST['formId'] ?? uniqid('form_temp_');
    $fieldName = $_POST['fieldName'] ?? 'unknown';
    
    $formDir = $uploadDir . $formId . '/';
    if (!is_dir($formDir)) {
        mkdir($formDir, 0755, true);
    }
    
    $uploadedFiles = [];
    
    // Process uploaded files
    if (isset($_FILES['files'])) {
        $files = $_FILES['files'];
        
        // Handle multiple files
        if (is_array($files['name'])) {
            for ($i = 0; $i < count($files['name']); $i++) {
                if ($files['error'][$i] === UPLOAD_ERR_OK) {
                    $originalName = $files['name'][$i];
                    $fileName = sanitizeFileName($originalName);
                    $uniqueFileName = $fieldName . '_' . uniqid() . '_' . $fileName;
                    $targetPath = $formDir . $uniqueFileName;
                    
                    if (move_uploaded_file($files['tmp_name'][$i], $targetPath)) {
                        $fileInfo = [
                            'id' => uniqid('file_'),
                            'originalName' => $originalName,
                            'fileName' => $uniqueFileName,
                            'path' => $targetPath,
                            'size' => $files['size'][$i],
                            'type' => $files['type'][$i],
                            'formattedSize' => formatFileSize($files['size'][$i]),
                            'uploadedAt' => date('Y-m-d H:i:s')
                        ];
                        
                        $uploadedFiles[] = $fileInfo;
                    }
                }
            }
        } else {
            // Handle single file
            if ($files['error'] === UPLOAD_ERR_OK) {
                $originalName = $files['name'];
                $fileName = sanitizeFileName($originalName);
                $uniqueFileName = $fieldName . '_' . uniqid() . '_' . $fileName;
                $targetPath = $formDir . $uniqueFileName;
                
                if (move_uploaded_file($files['tmp_name'], $targetPath)) {
                    $fileInfo = [
                        'id' => uniqid('file_'),
                        'originalName' => $originalName,
                        'fileName' => $uniqueFileName,
                        'path' => $targetPath,
                        'size' => $files['size'],
                        'type' => $files['type'],
                        'formattedSize' => formatFileSize($files['size']),
                        'uploadedAt' => date('Y-m-d H:i:s')
                    ];
                    
                    $uploadedFiles[] = $fileInfo;
                }
            }
        }
    }
    
    if (empty($uploadedFiles)) {
        echo json_encode([
            'success' => false,
            'error' => 'Žádné soubory nebyly nahrány'
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'files' => $uploadedFiles,
            'message' => 'Úspěšně nahráno ' . count($uploadedFiles) . ' soubor(ů)'
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

function sanitizeFileName($fileName) {
    // Remove dangerous characters but keep Czech characters
    $fileName = preg_replace('/[<>:"/\\|?*]/', '', $fileName);
    $fileName = preg_replace('/\s+/', '_', $fileName);
    return $fileName;
}

function formatFileSize($bytes) {
    if ($bytes == 0) return '0 B';
    
    $units = ['B', 'KB', 'MB', 'GB'];
    $factor = floor(log($bytes) / log(1024));
    
    return round($bytes / pow(1024, $factor), 2) . ' ' . $units[$factor];
}
?>
