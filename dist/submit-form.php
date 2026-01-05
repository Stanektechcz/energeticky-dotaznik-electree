<?php

// SUPER SIMPLE AUTH - admin/admin123 only  
// Updated: 2025-10-06 18:35 - Force upload with name/email fix
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

// POST request for authentication
if ($method === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        echo json_encode([
            'success' => false,
            'error' => 'Invalid JSON input'
        ]);
        exit;
    }
    
    $action = $data['action'] ?? 'login';
    
    switch ($action) {
        case 'login':
            $username = $data['username'] ?? $data['nickname'] ?? '';
            $password = $data['password'] ?? '';
            
            // Simple hardcoded check
            if ($username === 'admin' && $password === 'admin123') {
                $_SESSION['user_id'] = 1;
                $_SESSION['username'] = 'admin';
                $_SESSION['user_role'] = 'admin';
                $_SESSION['is_logged_in'] = true;
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Login successful',
                    'user' => [
                        'id' => 1,
                        'username' => 'admin',
                        'name' => 'Administrator',
                        'email' => 'admin@electree.cz',
                        'role' => 'admin'
                    ],
                    'session_id' => session_id()
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid credentials'
                ]);
            }
            break;
            
        default:
            echo json_encode([
                'success' => false,
                'error' => 'Invalid action'
            ]);
    }
    exit;
}

echo json_encode([
    'success' => false,
    'error' => 'Method not allowed'
]);
?>
