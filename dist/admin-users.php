<?php
session_start();

// Kontrola oprávnění
if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    header('Location: /');
    exit();
}

// Log page view activity
if (isset($_SESSION['user_id'])) {
    try {
        require_once __DIR__ . '/UserActivityTracker.php';
        $tracker = new UserActivityTracker();
        $tracker->logActivity($_SESSION['user_id'], 'page_view', 'Zobrazení správy uživatelů');
    } catch (Exception $e) {
        error_log("Activity logging error: " . $e->getMessage());
    }
}

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Správa uživatelů - Admin Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: {
                            50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc',
                            400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1',
                            800: '#075985', 900: '#0c4a6e'
                        }
                    }
                }
            }
        };
    </script>
</head>
<body class="bg-gray-50">
    <!-- Navigation Header -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <div class="flex-shrink-0 flex items-center">
                        <h1 class="text-xl font-bold text-gray-900">Admin Panel</h1>
                    </div>
                    <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                        <a href="admin-dashboard.php" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-4 px-1 text-sm font-medium">
                            📊 Dashboard
                        </a>
                        <a href="admin-users.php" class="border-primary-500 text-primary-600 border-b-2 py-4 px-1 text-sm font-medium">
                            👥 Uživatelé
                        </a>
                        <a href="admin-forms.php" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-4 px-1 text-sm font-medium">
                            📝 Formuláře
                        </a>
                        <a href="admin-activity.php" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-4 px-1 text-sm font-medium">
                            📋 Aktivita
                        </a>
                        <a href="admin-settings.php" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-4 px-1 text-sm font-medium">
                            ⚙️ Nastavení
                        </a>
                    </div>
                </div>
                <div class="flex items-center">
                    <span class="text-sm text-gray-700 mr-4">
                        <?= htmlspecialchars($_SESSION['user_name'] ?? 'Admin') ?>
                    </span>
                    <a href="logout.php" class="text-sm text-gray-500 hover:text-gray-700">
                        Odhlásit se
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <!-- Page Header -->
            <div class="mb-8 flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Správa uživatelů
                    </h2>
                    <p class="mt-1 text-sm text-gray-500">
                        Správa uživatelských účtů a oprávnění
                    </p>
                </div>
                <button onclick="showCreateUserModal()" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    + Nový uživatel
                </button>
            </div>

            <!-- Search and Filters -->
            <div class="bg-white p-6 rounded-lg shadow mb-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Hledat uživatele</label>
                        <input type="text" id="user-search" placeholder="Jméno, email, telefon..." 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select id="role-filter" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="">Všechny role</option>
                            <option value="admin">Administrátor</option>
                            <option value="salesman">Obchodník</option>
                            <option value="partner">Partner</option>
                            <option value="customer">Zákazník</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select id="status-filter" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="">Všechny statusy</option>
                            <option value="active">Aktivní</option>
                            <option value="inactive">Neaktivní</option>
                        </select>
                    </div>
                </div>
                <div class="mt-4 flex justify-between">
                    <button onclick="searchUsers()" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm">
                        Vyhledat
                    </button>
                    <button onclick="clearFilters()" class="text-gray-600 hover:text-gray-800 text-sm">
                        Vymazat filtry
                    </button>
                </div>
            </div>

            <!-- Users Table -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Seznam uživatelů</h3>
                </div>
                <div class="overflow-x-auto">
                    <div id="users-table">
                        <div class="animate-pulse p-6">
                            <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Pagination -->
                <div id="users-pagination" class="px-6 py-4 border-t border-gray-200 hidden">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-700">
                                Zobrazeno <span id="users-showing-start">1</span> až <span id="users-showing-end">20</span> z celkem <span id="users-total">0</span> uživatelů
                            </p>
                        </div>
                        <div class="flex space-x-2">
                            <button id="users-prev-btn" onclick="changeUsersPage(currentUsersPage - 1)" 
                                    class="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Předchozí
                            </button>
                            <span id="users-page-info" class="px-3 py-1 text-sm text-gray-700">Stránka 1 z 1</span>
                            <button id="users-next-btn" onclick="changeUsersPage(currentUsersPage + 1)" 
                                    class="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Další
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- User Create/Edit Modal -->
    <div id="userModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
        <div class="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div class="mt-3">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900" id="modalTitle">Nový uživatel</h3>
                    <button onclick="hideUserModal()" class="text-gray-400 hover:text-gray-600">
                        <span class="sr-only">Zavřít</span>
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                
                <form id="userForm" onsubmit="submitUserForm(event)">
                    <input type="hidden" id="userId" name="user_id">
                    
                    <!-- Basic Information -->
                    <div class="mb-6">
                        <h4 class="text-md font-medium text-gray-800 mb-3 border-b pb-2">Základní informace</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Jméno *</label>
                                <input type="text" id="userName" name="name" required
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                <input type="email" id="userEmail" name="email" required
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                                <select id="userRole" name="role" required
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                                    <option value="customer">Zákazník</option>
                                    <option value="salesman">Obchodník</option>
                                    <option value="partner">Partner</option>
                                    <option value="admin">Administrátor</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Heslo</label>
                                <input type="password" id="userPassword" name="password" 
                                       placeholder="Ponechte prázdné pro zachování současného" autocomplete="new-password"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                            </div>
                        </div>
                    </div>

                    <!-- Contact Information -->
                    <div class="mb-6">
                        <h4 class="text-md font-medium text-gray-800 mb-3 border-b pb-2">Kontaktní údaje</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                                <input type="tel" id="userPhone" name="phone" 
                                       placeholder="+420 123 456 789"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Název společnosti</label>
                                <input type="text" id="userCompanyName" name="company_name" 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Adresa</label>
                                <textarea id="userAddress" name="address" rows="2" 
                                          placeholder="Ulice, město, PSČ"
                                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Billing Information -->
                    <div class="mb-6">
                        <h4 class="text-md font-medium text-gray-800 mb-3 border-b pb-2">Fakturační údaje</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">IČO</label>
                                <input type="text" id="userIco" name="ico" 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">DIČ</label>
                                <input type="text" id="userDic" name="dic" 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Fakturační adresa</label>
                                <textarea id="userBillingAddress" name="billing_address" rows="2" 
                                          placeholder="Fakturační adresa (pokud se liší od standardní adresy)"
                                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Status -->
                    <div class="mb-6">
                        <div class="flex items-center">
                            <input type="checkbox" id="userActive" name="active" checked
                                   class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
                            <label for="userActive" class="ml-2 block text-sm text-gray-900">
                                Aktivní uživatel
                            </label>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex justify-end space-x-3">
                        <button type="button" onclick="hideUserModal()" 
                                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Zrušit
                        </button>
                        <button type="submit" 
                                class="px-4 py-2 bg-primary-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-700">
                            Uložit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        // Console logging utility
        const log = {
            info: (msg, data = null) => {
                console.log(`[Users] ${msg}`, data);
            },
            error: (msg, error = null) => {
                console.error(`[Users] ${msg}`, error);
            },
            warn: (msg, data = null) => {
                console.warn(`[Users] ${msg}`, data);
            }
        };

        let currentUsersPage = 1;
        const usersPageSize = 20;
        let csrfToken = null;
        let availableRoles = []; // Role načtené z databáze

        // Security: Get CSRF token
        // Security: Get CSRF token
        async function getCSRFToken() {
            try {
                const response = await fetch('admin-users-api.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'get_csrf_token' })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                log.info('CSRF response data:', data);
                
                if (data.success && data.csrf_token) {
                    csrfToken = data.csrf_token;
                    log.info('CSRF token získán:', csrfToken);
                } else {
                    throw new Error(data.message || 'Nepodařilo se získat CSRF token');
                }
            } catch (error) {
                log.error('Nepodařilo se získat CSRF token', error);
                // Zkusit znovu za 2 sekundy
                setTimeout(getCSRFToken, 2000);
            }
        }

        // Load available roles from database
        async function loadAvailableRoles() {
            try {
                log.info('Attempting to load roles from database...');
                const data = await secureApiCall({ action: 'list_roles' });
                
                log.info('Roles API response received:', data);
                
                if (data.success && data.data) {
                    availableRoles = data.data;
                    log.info('Roles loaded from database. Count:', availableRoles.length);
                    log.info('Roles structure:', availableRoles);
                    
                    // Update role select options
                    updateRoleSelectOptions();
                } else {
                    log.warn('API failed, using fallback roles. Response:', data);
                    // Fallback to default roles if database fails
                    availableRoles = [
                        { role_key: 'customer', role_name: 'Zákazník' },
                        { role_key: 'salesman', role_name: 'Obchodník' },
                        { role_key: 'partner', role_name: 'Partner' },
                        { role_key: 'admin', role_name: 'Administrátor' }
                    ];
                    log.warn('Using fallback roles:', availableRoles);
                    updateRoleSelectOptions();
                }
            } catch (error) {
                log.error('Failed to load roles, using fallback', error);
                // Fallback to default roles
                availableRoles = [
                    { role_key: 'customer', role_name: 'Zákazník' },
                    { role_key: 'salesman', role_name: 'Obchodník' },
                    { role_key: 'partner', role_name: 'Partner' },
                    { role_key: 'admin', role_name: 'Administrátor' }
                ];
                updateRoleSelectOptions();
            }
        }

        // Update role select options in forms and filters
        function updateRoleSelectOptions() {
            const selects = ['userRole', 'role-filter'];
            
            selects.forEach(selectId => {
                const select = document.getElementById(selectId);
                if (select) {
                    // Zachovat aktuální hodnotu
                    const currentValue = select.value;
                    
                    // Vyčistit options (kromě "Všechny role" u filtru)
                    if (selectId === 'role-filter') {
                        select.innerHTML = '<option value="">Všechny role</option>';
                    } else {
                        select.innerHTML = '';
                    }
                    
                    // Přidat role z databáze
                    availableRoles.forEach(role => {
                        const option = document.createElement('option');
                        option.value = role.role_key;
                        option.textContent = role.role_name;
                        select.appendChild(option);
                    });
                    
                    // Obnovit původní hodnotu pokud existuje
                    if (currentValue && availableRoles.find(r => r.role_key === currentValue)) {
                        select.value = currentValue;
                    }
                }
            });
        }

        // Enhanced fetch with CSRF protection
        async function secureApiCall(requestData) {
            const modifyingActions = ['create_user', 'update_user', 'delete', 'delete_user'];
            
            // Pro modifikující akce zkontrolovat CSRF token
            if (modifyingActions.includes(requestData.action)) {
                if (!csrfToken) {
                    log.warn('CSRF token není k dispozici, pokusím se získat nový');
                    await getCSRFToken();
                    if (!csrfToken) {
                        throw new Error('Nepodařilo se získat CSRF token');
                    }
                }
                requestData.csrf_token = csrfToken;
            }
            
            try {
                const response = await fetch('admin-users-api.php', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken || ''
                    },
                    body: JSON.stringify(requestData)
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const result = await response.json();
                
                // Pokud API vrátí chybu CSRF tokenu, zkusit získat nový
                if (!result.success && result.message && result.message.includes('CSRF')) {
                    log.warn('CSRF token expired, getting new one');
                    await getCSRFToken();
                    
                    // Zkusit požadavek znovu s novým tokenem
                    if (csrfToken && modifyingActions.includes(requestData.action)) {
                        requestData.csrf_token = csrfToken;
                        const retryResponse = await fetch('admin-users-api.php', {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json',
                                'X-CSRF-Token': csrfToken
                            },
                            body: JSON.stringify(requestData)
                        });
                        
                        if (retryResponse.ok) {
                            return await retryResponse.json();
                        }
                    }
                }
                
                return result;
            } catch (error) {
                log.error('API call failed:', error);
                throw error;
            }
        }

        // Performance optimizations
        let isLoading = false;
        let userCache = new Map();
        let lastSearchQuery = '';
        
        // Debounced search to reduce API calls
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
        
        // Optimized search with caching
        const debouncedSearch = debounce(() => {
            const search = document.getElementById('user-search').value;
            const role = document.getElementById('role-filter').value;
            const status = document.getElementById('status-filter').value;
            
            // Only search if query changed significantly
            const currentQuery = `${search}|${role}|${status}`;
            if (currentQuery !== lastSearchQuery) {
                lastSearchQuery = currentQuery;
                loadUsers(1, search, role, status);
            }
        }, 300);
        
        // Cache user details to avoid repeated API calls
        async function getCachedUser(userId) {
            if (userCache.has(userId)) {
                return userCache.get(userId);
            }
            
            try {
                const data = await secureApiCall({ 
                    action: 'get_user',
                    user_id: userId
                });
                
                if (data.success && data.data) {
                    userCache.set(userId, data.data);
                    return data.data;
                }
            } catch (error) {
                log.error('Failed to load cached user', error);
            }
            
            return null;
        }

        // Clear user cache when data changes
        function invalidateUserCache(userId = null) {
            if (userId) {
                userCache.delete(userId);
            } else {
                userCache.clear();
            }
        }

        // Load users using the API
        async function loadUsers(page = 1, search = '', role = '', status = '') {
            if (isLoading) return;
            
            log.info('Loading users...', { page, search, role, status });
            isLoading = true;
            currentUsersPage = page;
            
            try {
                const response = await fetch('admin-users-api.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        action: 'list_users',
                        page: page,
                        per_page: usersPageSize,
                        search: search,
                        role: role,
                        status: status
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                log.info('Users data loaded', data);

                if (data.success) {
                    displayUsers(data.data.users || []);
                    updateUsersPagination(data.data.pagination.total_count || 0, page);
                } else {
                    throw new Error(data.error || 'Unknown error');
                }
            } catch (error) {
                log.error('Failed to load users', error);
                showToast('Nepodařilo se načíst seznam uživatelů', 'error');
            } finally {
                isLoading = false;
            }
        }

        function displayUsers(users) {
            const container = document.getElementById('users-table');
            
            if (!users || users.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8">
                        <div class="text-gray-400 text-lg mb-2">👥</div>
                        <h3 class="text-lg font-medium text-gray-900 mb-1">Žádní uživatelé</h3>
                        <p class="text-gray-500">Nebyly nalezeni žádní uživatelé odpovídající kritériím.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uživatel</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontakt</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrace</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akce</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${users.map(user => `
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 h-10 w-10">
                                            <div class="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                                                ${(user.name || 'U').charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900">${user.name || 'Neznámý'}</div>
                                            <div class="text-sm text-gray-500">${user.email || ''}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div>${user.phone || '-'}</div>
                                    <div class="text-xs text-gray-400">${user.company_name || ''}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleClass(user.role)}">
                                        ${getRoleLabel(user.role)}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(user.is_active == 1)}">
                                        ${user.is_active == 1 ? 'Aktivní' : 'Neaktivní'}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${user.created_at ? new Date(user.created_at).toLocaleDateString('cs-CZ') : '-'}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onclick="editUser('${user.id}')" class="text-primary-600 hover:text-primary-900 mr-3">
                                        Upravit
                                    </button>
                                    <button onclick="viewUserDetail('${user.id}')" class="text-green-600 hover:text-green-900 mr-3">
                                        Detail
                                    </button>
                                    ${user.is_active == 1 
                                        ? `<button onclick="confirmDeleteUser('${user.id}', '${user.name}')" class="text-red-600 hover:text-red-900">Deaktivovat</button>`
                                        : `<button onclick="confirmActivateUser('${user.id}', '${user.name}')" class="text-green-600 hover:text-green-900">Aktivovat</button>`
                                    }
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        function getRoleClass(role) {
            switch(role) {
                case 'admin': return 'bg-red-100 text-red-800';
                case 'salesman': return 'bg-blue-100 text-blue-800';
                case 'partner': return 'bg-purple-100 text-purple-800';
                case 'customer': return 'bg-green-100 text-green-800';
                default: return 'bg-gray-100 text-gray-800';
            }
        }

        function getRoleLabel(role) {
            // Hledat roli v načtených rolích z databáze
            const foundRole = availableRoles.find(r => r.role_key === role);
            if (foundRole) {
                return foundRole.role_name;
            }
            
            // Fallback na statické mapování
            switch(role) {
                case 'admin': return 'Administrátor';
                case 'salesman': return 'Obchodník';
                case 'partner': return 'Partner';
                case 'customer': return 'Zákazník';
                default: return role || 'Neznámý';
            }
        }

        function getStatusClass(active) {
            return active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        }

        function updateUsersPagination(totalCount, currentPage) {
            const totalPages = Math.ceil(totalCount / usersPageSize);
            const container = document.getElementById('users-pagination');
            
            if (totalCount > 0) {
                container.classList.remove('hidden');
                
                const startRecord = (currentPage - 1) * usersPageSize + 1;
                const endRecord = Math.min(currentPage * usersPageSize, totalCount);
                
                document.getElementById('users-showing-start').textContent = startRecord;
                document.getElementById('users-showing-end').textContent = endRecord;
                document.getElementById('users-total').textContent = totalCount;
                document.getElementById('users-page-info').textContent = `Stránka ${currentPage} z ${totalPages}`;
                
                const prevBtn = document.getElementById('users-prev-btn');
                const nextBtn = document.getElementById('users-next-btn');
                
                prevBtn.disabled = currentPage <= 1;
                nextBtn.disabled = currentPage >= totalPages;
            } else {
                container.classList.add('hidden');
            }
        }

        function changeUsersPage(page) {
            const search = document.getElementById('user-search').value;
            const role = document.getElementById('role-filter').value;
            const status = document.getElementById('status-filter').value;
            loadUsers(page, search, role, status);
        }

        function searchUsers() {
            debouncedSearch();
        }

        // Enhanced search on input change
        function setupEnhancedSearch() {
            const searchInput = document.getElementById('user-search');
            const roleFilter = document.getElementById('role-filter');
            const statusFilter = document.getElementById('status-filter');
            
            searchInput.addEventListener('input', debouncedSearch);
            roleFilter.addEventListener('change', debouncedSearch);
            statusFilter.addEventListener('change', debouncedSearch);
        }

        function clearFilters() {
            document.getElementById('user-search').value = '';
            document.getElementById('role-filter').value = '';
            document.getElementById('status-filter').value = '';
            loadUsers(1);
        }

        // Real-time validation functions
        function validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function validateField(fieldId, validationType = null) {
            const field = document.getElementById(fieldId);
            const value = field.value.trim();
            let isValid = true;
            let message = '';

            // Remove existing validation classes
            field.classList.remove('border-red-500', 'border-green-500');
            
            // Remove existing error message
            const existingError = field.parentElement.querySelector('.validation-error');
            if (existingError) {
                existingError.remove();
            }

            if (validationType === 'required' && !value) {
                isValid = false;
                message = 'Toto pole je povinné';
            } else if (validationType === 'email' && value && !validateEmail(value)) {
                isValid = false;
                message = 'Email má neplatný formát';
            } else if (validationType === 'length' && value.length > 100) {
                isValid = false;
                message = 'Text je příliš dlouhý (max 100 znaků)';
            }

            // Apply validation styling
            if (!isValid) {
                field.classList.add('border-red-500');
                const errorDiv = document.createElement('div');
                errorDiv.className = 'validation-error text-red-500 text-xs mt-1';
                errorDiv.textContent = message;
                field.parentElement.appendChild(errorDiv);
            } else if (value) {
                field.classList.add('border-green-500');
            }

            return isValid;
        }

        function setupRealTimeValidation() {
            // Name validation
            document.getElementById('userName').addEventListener('blur', function() {
                validateField('userName', 'required');
            });

            // Email validation
            document.getElementById('userEmail').addEventListener('blur', function() {
                const isRequired = validateField('userEmail', 'required');
                if (isRequired) {
                    validateField('userEmail', 'email');
                }
            });

            // Role validation
            document.getElementById('userRole').addEventListener('change', function() {
                validateField('userRole', 'required');
            });

            // Phone validation
            document.getElementById('userPhone').addEventListener('input', function() {
                // Format phone number as user types
                let value = this.value.replace(/\D/g, '');
                if (value.length >= 9) {
                    value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
                    if (value.startsWith('420')) {
                        value = '+420 ' + value.substring(3);
                    } else if (!value.startsWith('+')) {
                        value = '+420 ' + value;
                    }
                }
                this.value = value;
            });
        }

        // Toggle password visibility
        function togglePassword(fieldId) {
            const field = document.getElementById(fieldId);
            const type = field.getAttribute('type') === 'password' ? 'text' : 'password';
            field.setAttribute('type', type);
            
            // Update icon
            const button = field.nextElementSibling;
            const icon = button.querySelector('svg');
            
            if (type === 'text') {
                icon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                `;
            } else {
                icon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                `;
            }
        }

        // Enhanced modal show/hide with animations
        function showUserModal() {
            const modal = document.getElementById('userModal');
            
            if (modal) {
                modal.classList.remove('hidden');
                // Simple show without complex animations to avoid element access issues
                setTimeout(() => {
                    modal.style.opacity = '1';
                }, 10);
            }
        }

        function hideUserModal() {
            const modal = document.getElementById('userModal');
            
            if (modal) {
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.classList.add('hidden');
                    modal.style.opacity = ''; // Reset inline style
                }, 300);
            }
        }

        // Modal functions
        function showCreateUserModal() {
            document.getElementById('modalTitle').textContent = 'Nový uživatel';
            document.getElementById('userForm').reset();
            document.getElementById('userId').value = '';
            document.getElementById('userActive').checked = true;
            showUserModal();
        }

        // Bulk operations and selection
        let selectedUsers = new Set();

        function toggleUserSelection(userId, checkbox) {
            if (checkbox.checked) {
                selectedUsers.add(userId);
            } else {
                selectedUsers.delete(userId);
            }
            updateBulkActionsVisibility();
        }

        function toggleAllUsers(masterCheckbox) {
            const checkboxes = document.querySelectorAll('.user-checkbox');
            selectedUsers.clear();
            
            checkboxes.forEach(checkbox => {
                checkbox.checked = masterCheckbox.checked;
                if (masterCheckbox.checked) {
                    selectedUsers.add(checkbox.dataset.userId);
                }
            });
            updateBulkActionsVisibility();
        }

        function updateBulkActionsVisibility() {
            const count = selectedUsers.size;
            const bulkActions = document.getElementById('bulk-actions');
            const selectedCount = document.getElementById('selected-count');
            
            if (count > 0) {
                bulkActions.classList.remove('hidden');
                selectedCount.classList.remove('hidden');
                selectedCount.textContent = `${count} vybráno`;
            } else {
                bulkActions.classList.add('hidden');
                selectedCount.classList.add('hidden');
            }
        }

        function clearSelection() {
            selectedUsers.clear();
            document.querySelectorAll('.user-checkbox').forEach(cb => cb.checked = false);
            const masterCheckbox = document.getElementById('master-checkbox');
            if (masterCheckbox) masterCheckbox.checked = false;
            updateBulkActionsVisibility();
        }

        async function bulkActivateUsers() {
            if (selectedUsers.size === 0) return;
            
            showConfirmModal(
                'Aktivovat uživatele',
                `Opravdu chcete aktivovat ${selectedUsers.size} vybraných uživatelů?`,
                async () => {
                    await performBulkOperation('activate');
                },
                'Aktivovat všechny',
                'green'
            );
        }

        async function bulkDeactivateUsers() {
            if (selectedUsers.size === 0) return;
            
            showConfirmModal(
                'Deaktivovat uživatele',
                `Opravdu chcete deaktivovat ${selectedUsers.size} vybraných uživatelů?`,
                async () => {
                    await performBulkOperation('deactivate');
                },
                'Deaktivovat všechny',
                'red'
            );
        }

        async function performBulkOperation(operation) {
            const userIds = Array.from(selectedUsers);
            let successCount = 0;
            let errorCount = 0;
            
            // Show progress
            showToast(`Zpracovávám ${userIds.length} uživatelů...`, 'info');
            
            for (const userId of userIds) {
                try {
                    const action = operation === 'activate' ? 'update_user' : 'delete';
                    const requestData = { action, user_id: userId };
                    
                    if (operation === 'activate') {
                        requestData.is_active = 1;
                    }
                    
                    const result = await secureApiCall(requestData);
                    if (result.success) {
                        successCount++;
                        invalidateUserCache(userId); // Vymazat cache
                    } else {
                        errorCount++;
                    }
                } catch (error) {
                    errorCount++;
                }
            }
            
            // Show results
            if (successCount > 0) {
                showToast(`Úspěšně zpracováno ${successCount} uživatelů`, 'success');
            }
            if (errorCount > 0) {
                showToast(`Chyba při zpracování ${errorCount} uživatelů`, 'error');
            }
            
            // Refresh list and clear selection
            clearSelection();
            loadUsers(currentUsersPage);
        }

        // Export functionality
        async function exportUsers() {
            try {
                showToast('Generuji CSV export...', 'info');
                
                // Get current filter settings
                const search = document.getElementById('user-search').value;
                const role = document.getElementById('role-filter').value;
                const status = document.getElementById('status-filter').value;
                
                // Get all users with current filters (without pagination)
                const data = await secureApiCall({
                    action: 'list_users',
                    page: 1,
                    per_page: 10000, // Get all
                    search: search,
                    role: role,
                    status: status
                });
                
                if (data.success && data.data.users) {
                    generateCSV(data.data.users);
                } else {
                    throw new Error('Nepodařilo se načíst data pro export');
                }
            } catch (error) {
                showToast('Chyba při exportu: ' + error.message, 'error');
            }
        }

        function generateCSV(users) {
            const headers = [
                'ID', 'Jméno', 'Email', 'Role', 'Telefon', 'Společnost', 
                'Adresa', 'IČO', 'DIČ', 'Fakturační adresa', 'Stav', 
                'Celkem formulářů', 'Úspěšnost %', 'Vytvořen', 'Poslední přihlášení'
            ];
            
            const csvContent = [
                headers.join(','),
                ...users.map(user => [
                    user.id,
                    `"${user.name || ''}"`,
                    `"${user.email || ''}"`,
                    `"${getRoleLabel(user.role)}"`,
                    `"${user.phone || ''}"`,
                    `"${user.company_name || ''}"`,
                    `"${user.address || ''}"`,
                    `"${user.ico || ''}"`,
                    `"${user.dic || ''}"`,
                    `"${user.billing_address || ''}"`,
                    user.is_active == 1 ? 'Aktivní' : 'Neaktivní',
                    user.total_forms || 0,
                    user.success_rate || 0,
                    `"${user.created_at_formatted || ''}"`,
                    `"${user.last_login_formatted || 'Nikdy'}"`
                ].join(','))
            ].join('\n');
            
            // Create and download file
            const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `uzivatele_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showToast('CSV soubor byl stažen', 'success');
        }

        async function editUser(userId) {
            log.info('Editing user', userId);
            
            try {
                // Zajistit, že role jsou načtené před editací
                if (!availableRoles || availableRoles.length === 0) {
                    log.info('Roles not loaded yet, loading now...');
                    await loadAvailableRoles();
                }
                
                // Zkusit nejdříve cache
                let userData = await getCachedUser(userId);
                
                if (!userData) {
                    // Pokud není v cache, načíst z API
                    const data = await secureApiCall({ 
                        action: 'get_user',
                        user_id: userId
                    });
                    
                    if (data.success && data.data) {
                        userData = data.data;
                    } else {
                        throw new Error(data.message || 'User not found');
                    }
                }
                
                populateUserForm(userData);
                document.getElementById('modalTitle').textContent = 'Upravit uživatele';
                showUserModal();
            } catch (error) {
                log.error('Failed to load user for editing', error);
                showToast('Nepodařilo se načíst údaje uživatele', 'error');
            }
        }

        function populateUserForm(user) {
            document.getElementById('userId').value = user.id;
            document.getElementById('userName').value = user.name || '';
            document.getElementById('userEmail').value = user.email || '';
            
            // Debug log pro kontrolu role hodnoty
            console.log('User role value:', user.role, 'Type:', typeof user.role);
            console.log('Available roles:', availableRoles);
            
            // Mapování starších rolí na nové
            const roleMapping = {
                'user': 'customer',
                'client': 'customer', 
                'employee': 'salesman',
                'manager': 'admin'
            };
            
            // Nastavení role s fallbackem na customer
            const roleSelect = document.getElementById('userRole');
            
            // Získat seznam validních rolí z databáze
            let validRoles = [];
            
            if (Array.isArray(availableRoles) && availableRoles.length > 0) {
                // Kontrola, zda má každá role property role_key
                if (availableRoles[0].role_key) {
                    validRoles = availableRoles.map(r => r.role_key);
                } else if (availableRoles[0].value) {
                    // Alternativní struktura s value místo role_key
                    validRoles = availableRoles.map(r => r.value);
                } else {
                    // Pokud je to jen pole stringů
                    validRoles = availableRoles;
                }
            } else {
                // Fallback pokud nejsou role načtené
                validRoles = ['customer', 'salesman', 'partner', 'admin'];
                console.warn('No roles loaded, using fallback valid roles');
            }
            
            console.log('Valid roles:', validRoles);
            
            let userRole = user.role;
            
            // Kontrola prázdné nebo neplatné role
            if (!userRole || userRole.trim() === '') {
                // Pokusit se odhadnout roli podle jména
                const name = (user.name || '').toLowerCase();
                if (name.includes('admin')) {
                    userRole = 'admin';
                } else if (name.includes('sales') || name.includes('obchodnik') || name.includes('consultant')) {
                    userRole = 'salesman';
                } else if (name.includes('partner')) {
                    userRole = 'partner';
                } else {
                    userRole = 'customer';
                }
                console.log('Empty role detected, guessing:', userRole, 'based on name:', user.name);
            }
            
            // Mapování pokud je role stará
            if (roleMapping[userRole]) {
                const oldRole = userRole;
                userRole = roleMapping[userRole];
                console.log('Role mapped from', oldRole, 'to', userRole);
            }
            
            // Fallback na customer pokud role stále není validní
            if (!validRoles.includes(userRole)) {
                userRole = validRoles.includes('customer') ? 'customer' : validRoles[0] || 'customer';
                console.log('Invalid role, falling back to:', userRole);
            }
            
            roleSelect.value = userRole;
            
            document.getElementById('userPhone').value = user.phone || '';
            document.getElementById('userCompanyName').value = user.company_name || '';
            document.getElementById('userAddress').value = user.address || '';
            document.getElementById('userIco').value = user.ico || '';
            document.getElementById('userDic').value = user.dic || '';
            document.getElementById('userBillingAddress').value = user.billing_address || '';
            
            // Debug log pro kontrolu is_active hodnoty
            console.log('User is_active value:', user.is_active, 'Type:', typeof user.is_active);
            
            document.getElementById('userActive').checked = user.is_active == 1 || user.is_active === true;
            document.getElementById('userPassword').value = '';
        }

        async function submitUserForm(event) {
            event.preventDefault();
            log.info('Submitting user form...');
            
            const formData = new FormData(event.target);
            const userData = Object.fromEntries(formData.entries());
            
            // Oprava mapování checkbox pole is_active
            userData.is_active = document.getElementById('userActive').checked ? 1 : 0;
            
            // Získání user_id z hidden fieldu
            const userIdField = document.getElementById('userId');
            const userId = userIdField ? userIdField.value : '';
            
            if (userId) {
                userData.user_id = userId;
            }
            
            // Validace povinných polí
            if (!userData.name || !userData.email || !userData.role) {
                showToast('Vyplňte všechna povinná pole (Jméno, Email, Role)', 'error');
                return;
            }
            
            // Zajištění platné role
            const validRoles = availableRoles.map(r => r.role_key);
            if (!validRoles.includes(userData.role)) {
                userData.role = validRoles.includes('customer') ? 'customer' : validRoles[0] || 'customer';
            }
            
            // Debug log pro kontrolu odesílaných dat
            console.log('Form userData before submit:', userData);
            
            const isEdit = userId !== '';
            const action = isEdit ? 'update_user' : 'create_user';
            
            const requestData = { 
                action: action,
                ...userData
            };
            
            console.log('Request data being sent:', requestData);
            
            try {
                // Použití secureApiCall pro CSRF token
                const data = await secureApiCall(requestData);
                log.info('User form submitted', data);
                
                if (data.success) {
                    showToast(isEdit ? 'Uživatel byl úspěšně upraven' : 'Uživatel byl úspěšně vytvořen', 'success');
                    hideUserModal();
                    invalidateUserCache(userId); // Vymazat cache pro tohoto uživatele
                    loadUsers(currentUsersPage);
                } else {
                    throw new Error(data.message || 'Unknown error');
                }
            } catch (error) {
                log.error('Failed to save user', error);
                showToast('Nepodařilo se uložit uživatele: ' + error.message, 'error');
            }
        }

        function confirmDeleteUser(userId, userName) {
            // Use modal instead of confirm dialog
            showConfirmModal(
                'Deaktivovat uživatele',
                `Opravdu chcete deaktivovat uživatele "${userName}"?`,
                () => deleteUser(userId),
                'Deaktivovat'
            );
        }

        function confirmActivateUser(userId, userName) {
            // Use modal instead of confirm dialog
            showConfirmModal(
                'Aktivovat uživatele',
                `Opravdu chcete aktivovat uživatele "${userName}"?`,
                () => activateUser(userId),
                'Aktivovat',
                'green'
            );
        }

        async function deleteUser(userId) {
            log.info('Deactivating user', userId);
            
            if (!userId || String(userId).trim() === '') {
                throw new Error('ID uživatele je prázdné');
            }
            
            try {
                const data = await secureApiCall({ 
                    action: 'delete',
                    user_id: userId
                });
                
                log.info('Delete response data:', data);
                
                if (data.success) {
                    showToast('Uživatel byl úspěšně deaktivován', 'success');
                    invalidateUserCache(userId); // Vymazat cache
                    loadUsers(currentUsersPage);
                } else {
                    throw new Error(data.message || data.error || 'Unknown error');
                }
            } catch (error) {
                log.error('Failed to deactivate user', error);
                showToast('Nepodařilo se deaktivovat uživatele: ' + error.message, 'error');
            }
        }

        async function activateUser(userId) {
            log.info('Activating user', userId);
            
            if (!userId || String(userId).trim() === '') {
                throw new Error('ID uživatele je prázdné');
            }
            
            try {
                const data = await secureApiCall({ 
                    action: 'update_user',
                    user_id: userId,
                    is_active: 1
                });
                
                log.info('Activate response data:', data);
                
                if (data.success) {
                    showToast('Uživatel byl úspěšně aktivován', 'success');
                    invalidateUserCache(userId); // Vymazat cache
                    loadUsers(currentUsersPage);
                } else {
                    throw new Error(data.message || data.error || 'Unknown error');
                }
            } catch (error) {
                log.error('Failed to activate user', error);
                showToast('Nepodařilo se aktivovat uživatele: ' + error.message, 'error');
            }
        }

        function viewUserDetail(userId) {
            window.location.href = `user-detail.php?id=${userId}`;
        }

        function showToast(message, type = 'info') {
            const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';
            const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
            
            const toast = document.createElement('div');
            toast.className = `fixed top-4 right-4 ${bgColor} text-white p-4 rounded-lg shadow-lg z-50 max-w-sm`;
            toast.innerHTML = `
                <div class="flex items-center">
                    <span class="mr-2">${icon}</span>
                    <span class="flex-1">${message}</span>
                    <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">✕</button>
                </div>
            `;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 5000);
        }

        function showConfirmModal(title, message, onConfirm, buttonText = 'Potvrdit', buttonColor = 'red') {
            const buttonClass = buttonColor === 'green' 
                ? 'px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md hover:bg-green-700'
                : 'px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md hover:bg-red-700';
                
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
            modal.innerHTML = `
                <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div class="mt-3 text-center">
                        <h3 class="text-lg font-medium text-gray-900">${title}</h3>
                        <div class="mt-2 px-7 py-3">
                            <p class="text-sm text-gray-500">${message}</p>
                        </div>
                        <div class="flex justify-center space-x-3 px-4 py-3">
                            <button id="cancel-btn" 
                                    class="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md hover:bg-gray-400">
                                Zrušit
                            </button>
                            <button id="confirm-btn" 
                                    class="${buttonClass}">
                                ${buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add event listeners instead of inline onclick
            const cancelBtn = modal.querySelector('#cancel-btn');
            const confirmBtn = modal.querySelector('#confirm-btn');
            
            cancelBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            confirmBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
                onConfirm();
            });
            
            document.body.appendChild(modal);
        }

        // Initialize page
        document.addEventListener('DOMContentLoaded', async function() {
            log.info('Users page initializing...');
            
            try {
                // Initialize security
                await getCSRFToken();
                
                // Load available roles from database
                await loadAvailableRoles();
                
                // Load users
                await loadUsers();
                
                // Setup additional features
                setupRealTimeValidation();
                setupEnhancedSearch();
                
                // Search on Enter key
                document.getElementById('user-search').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        searchUsers();
                    }
                });
                
                log.info('Users page initialized successfully');
            } catch (error) {
                log.error('Failed to initialize users page', error);
                showToast('Chyba při inicializaci stránky', 'error');
            }
        });
    </script>
</body>
</html>
