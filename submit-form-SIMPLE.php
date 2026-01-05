<?php
// SUPER SIMPLE AUTH - admin/admin123 only
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// GET request for testing
if ($method === 'GET') {
    echo json_encode([
        'success' => true,
        'message' => 'SIMPLE AUTH WORKING!',
        'timestamp' => date('Y-m-d H:i:s'),
        'method' => 'GET',
        'session_id' => session_id()
    ]);
    exit;
}

// Only allow POST
if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

$action = $data['action'] ?? '';

switch ($action) {
    case 'login':
        $nickname = trim($data['nickname'] ?? '');
        $password = $data['password'] ?? '';
        
        // Simple hardcoded check
        if ($nickname === 'admin' && $password === 'admin123') {
            $_SESSION['user_id'] = 'admin_001';
            $_SESSION['user_name'] = 'admin';
            $_SESSION['user_role'] = 'admin';
            
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => 'admin_001',
                    'name' => 'admin',
                    'role' => 'admin'
                ]
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'Invalid credentials'
            ]);
        }
        break;
        
    case 'logout':
        session_destroy();
        echo json_encode([
            'success' => true,
            'message' => 'Logout successful'
        ]);
        break;
        
    case 'check_session':
        if (isset($_SESSION['user_id'])) {
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $_SESSION['user_id'],
                    'name' => $_SESSION['user_name'],
                    'role' => $_SESSION['user_role']
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Not logged in']);
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
}
exit;
?>