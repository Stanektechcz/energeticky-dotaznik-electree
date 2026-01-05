// Enhanced displayUserDetail function with comprehensive contact and billing sections

function displayUserDetail(userData) {
    document.getElementById('currentUserId').textContent = userData.id;
    document.getElementById('user-detail-content').innerHTML = `
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    ${userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">${userData.name || 'Uživatel'}</h1>
                    <p class="text-gray-600">${userData.email || 'Bez emailu'}</p>
                    <div class="flex items-center space-x-2 mt-1">
                        <span class="px-2 py-1 text-xs rounded-full ${userData.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                            ${userData.is_active ? 'Aktivní' : 'Neaktivní'}
                        </span>
                        <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            ${getRoleLabel(userData.role)}
                        </span>
                    </div>
                </div>
            </div>
            <div class="flex space-x-2">
                <button onclick="showEditUserModal(${userData.id})" 
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                    <span>Upravit</span>
                </button>
                <button onclick="showUserView()" 
                        class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    Zpět
                </button>
            </div>
        </div>

        <!-- Contact & Billing Information Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Contact Information -->
            <div class="bg-white p-6 rounded-lg shadow border">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    Kontaktní údaje
                </h3>
                <div class="grid grid-cols-1 gap-4">
                    <div>
                        <label class="text-sm font-medium text-gray-600">Telefon:</label>
                        <p class="text-gray-900 font-medium">${userData.phone || 'Neuvedeno'}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-600">Firma:</label>
                        <p class="text-gray-900 font-medium">${userData.company || 'Neuvedeno'}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-600">Adresa:</label>
                        <p class="text-gray-900">${userData.address || 'Neuvedeno'}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-medium text-gray-600">IČO:</label>
                            <p class="text-gray-900 font-mono">${userData.ico || 'Neuvedeno'}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-600">DIČ:</label>
                            <p class="text-gray-900 font-mono">${userData.dic || 'Neuvedeno'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Billing Information -->
            <div class="bg-white p-6 rounded-lg shadow border">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h8zM6 8a2 2 0 012 2v2H6V8zm6 0a2 2 0 012 2v2h-2V8z"/>
                    </svg>
                    Fakturační údaje
                </h3>
                <div class="grid grid-cols-1 gap-4">
                    <div>
                        <label class="text-sm font-medium text-gray-600">Fakturační název:</label>
                        <p class="text-gray-900 font-medium">${userData.billing_name || 'Neuvedeno'}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-600">Fakturační adresa:</label>
                        <p class="text-gray-900">${userData.billing_address || 'Neuvedeno'}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Activity Summary & Recent Forms -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Activity Summary -->
            <div class="bg-white p-6 rounded-lg shadow border">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                    </svg>
                    Souhrn aktivity
                </h3>
                <div class="space-y-4">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Registrace:</span>
                        <span class="font-medium">${userData.created_at_formatted || 'Neuvedeno'}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Poslední přihlášení:</span>
                        <span class="font-medium">${userData.last_login_formatted || 'Nikdy'}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Aktivní hodin (30 dní):</span>
                        <span class="font-medium text-blue-600">${userData.active_hours || 0}h</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Status účtu:</span>
                        <span class="px-2 py-1 text-xs rounded-full ${userData.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                            ${userData.is_active ? 'Aktivní' : 'Neaktivní'}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Recent Forms -->
            <div class="bg-white p-6 rounded-lg shadow border">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v2H6V6z"/>
                    </svg>
                    Nedávné formuláře
                </h3>
                <div class="space-y-3">
                    ${userData.recent_forms && userData.recent_forms.length > 0 ? userData.recent_forms.map(form => `
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div class="flex-1">
                                <p class="text-sm font-medium">${form.title || 'Formulář ID: ' + form.id}</p>
                                <p class="text-xs text-gray-500">${new Date(form.created_at).toLocaleDateString('cs-CZ')}</p>
                            </div>
                            <span class="px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(form.status)}">
                                ${getStatusLabel(form.status)}
                            </span>
                        </div>
                    `).join('') : '<p class="text-gray-500 text-center py-4">Žádné formuláře</p>'}
                </div>
            </div>
        </div>

        <!-- Basic Information Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- User Details -->
            <div class="bg-white p-6 rounded-lg shadow border">
                <h3 class="text-lg font-semibold mb-4">Základní informace</h3>
                <div class="grid grid-cols-1 gap-4">
                    <div>
                        <label class="text-sm font-medium text-gray-600">Jméno:</label>
                        <p class="text-gray-900">${userData.name || 'Neuvedeno'}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-600">Email:</label>
                        <p class="text-gray-900">${userData.email || 'Neuvedeno'}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-600">Role:</label>
                        <p class="text-gray-900">${getRoleLabel(userData.role)}</p>
                    </div>
                </div>
            </div>
            
            <!-- Activity Log -->
            <div class="bg-white p-6 rounded-lg shadow border">
                <h3 class="text-lg font-semibold mb-4">Poslední aktivity</h3>
                <div class="space-y-3">
                    ${userData.recent_activities && userData.recent_activities.length > 0 ? userData.recent_activities.map(activity => `
                        <div class="flex items-start space-x-3">
                            <div class="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                            <div class="flex-1">
                                <p class="text-sm font-medium">${activity.description || activity.action_type}</p>
                                <p class="text-xs text-gray-500">${new Date(activity.created_at).toLocaleString('cs-CZ')}</p>
                            </div>
                        </div>
                    `).join('') : '<p class="text-gray-500 text-center py-4">Žádné aktivity</p>'}
                </div>
            </div>
        </div>
    `;
    
    // Load charts after content is rendered
    setTimeout(() => {
        loadUserFormsChart(userData.charts?.forms || []);
        loadUserActivityChart(userData.charts?.activity || []);
        
        // Initialize forms list with pagination
        loadUserFormsList(userData.id, 1);
        
        // Setup search and filter event listeners
        setupUserFormsFilters(userData.id);
    }, 100);
}
