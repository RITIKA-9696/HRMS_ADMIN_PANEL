// ============================================================
// HEADER.JS - Header Component Functionality
// ============================================================
// NOTE: API_BASE_URL is already defined in common.js
// NOTE: DEBUG is already defined (or set here if not)

// ========== CONFIGURATION ==========
const HEADER_DEBUG = true;  // Renamed to avoid conflicts

// ========== DEBUG LOGGING ==========
function debugLog(...args) {
    if (typeof DEBUG !== 'undefined' ? DEBUG : HEADER_DEBUG) {
        console.log('[HEADER]', ...args);
    }
}

function debugError(...args) {
    if (typeof DEBUG !== 'undefined' ? DEBUG : HEADER_DEBUG) {
        console.error('[HEADER ERROR]', ...args);
    }
}

function debugInfo(title, data) {
    if (typeof DEBUG !== 'undefined' ? DEBUG : HEADER_DEBUG) {
        console.group(`[HEADER] ${title}`);
        console.log(data);
        console.groupEnd();
    }
}

// ========== UTILITY FUNCTIONS ==========

function getAllCookies() {
    const cookies = {};
    document.cookie.split(';').forEach(c => {
        const [key, val] = c.trim().split('=');
        if (key) cookies[key] = val;
    });
    return cookies;
}

// ========== HEADER POSITION ==========

function updateHeaderPosition() {
    const sidebar = document.querySelector('.main-sidebar');
    const header = document.querySelector('.main-header');
    if (sidebar && header) {
        const isCollapsed = sidebar.classList.contains('collapsed');
        header.style.left = isCollapsed ? '70px' : '256px';
        debugLog('Header position updated:', isCollapsed ? '70px' : '256px');
    }
}

// ========== MAIN USER DATA LOADING ==========

/**
 * Load user data from localStorage or backend
 */
function loadUserData() {
    try {
        const isLoggedIn = localStorage.getItem('hrms_logged_in');

        if (isLoggedIn !== 'true') {
            return verifySessionWithBackend();
        }

        const userDataStr = localStorage.getItem('hrms_user');

        if (!userDataStr) {
            return redirectToLogin();
        }

        const userData = JSON.parse(userDataStr);

        displayUserInfo(userData);

    } catch (error) {
        console.error('Error loading user data:', error);
        displayLoadingError();
    }
}

/**
 * Display user information in header
 */
function displayUserInfo(userData) {
    try {
        debugLog('Displaying user info with data:', userData);

        // Get data from userData (with fallbacks)
        const firstName = userData.firstName || '';
        const lastName = userData.lastName || '';
        const mobile = userData.mobile || '';
        const role = userData.role || 'ADMIN';
        const adminId = userData.adminId || '';

        // Generate display name - SHOW FIRST NAME + LAST NAME
        let displayName = '';
        if (firstName && lastName) {
            displayName = `${firstName} ${lastName}`;
        } else if (firstName) {
            displayName = firstName;
        } else if (lastName) {
            displayName = lastName;
        } else if (mobile) {
            displayName = mobile;
        } else {
            displayName = 'Admin User';
        }

        debugLog('Display name generated:', displayName);

        // Generate initials from first name
        let initials = 'AD';
        if (firstName && firstName.length >= 1) {
            initials = firstName.substring(0, 1).toUpperCase();
            if (lastName && lastName.length >= 1) {
                initials += lastName.substring(0, 1).toUpperCase();
            } else if (firstName.length >= 2) {
                initials = firstName.substring(0, 2).toUpperCase();
            }
        } else if (mobile && mobile.length >= 2) {
            initials = mobile.substring(0, 2).toUpperCase();
        }

        // Role display
        const roleDisplay = role === 'SUPER_ADMIN' ? 'Super Admin' :
            (role === 'ADMIN' ? 'Admin' : role);

        debugLog('Computed values:', { displayName, initials, roleDisplay, firstName, lastName });

        // Update DOM elements
        const elements = {
            userInitial: document.getElementById('userInitial'),
            userName: document.getElementById('userName'),
            userRole: document.getElementById('userRole'),
            menuUserName: document.getElementById('menuUserName'),
            menuUserMobile: document.getElementById('menuUserMobile'),
            menuAdminId: document.getElementById('menuAdminId')
        };

        // Log which elements are found
        Object.entries(elements).forEach(([key, el]) => {
            debugLog(`Element #${key}:`, el ? 'found' : 'MISSING');
        });

        // Update the elements
        if (elements.userInitial) {
            elements.userInitial.textContent = initials;
            debugLog('✅ Updated userInitial:', initials);
        }
        if (elements.userName) {
            elements.userName.textContent = displayName;
            debugLog('✅ Updated userName:', displayName);
        }
        if (elements.userRole) {
            elements.userRole.textContent = roleDisplay;
            debugLog('✅ Updated userRole:', roleDisplay);
        }
        if (elements.menuUserName) {
            elements.menuUserName.textContent = displayName;
            debugLog('✅ Updated menuUserName:', displayName);
        }
        if (elements.menuUserMobile) {
            elements.menuUserMobile.textContent = mobile || 'N/A';
            debugLog('✅ Updated menuUserMobile:', mobile);
        }
        if (elements.menuAdminId) {
            elements.menuAdminId.textContent = adminId || '-';
            debugLog('✅ Updated menuAdminId:', adminId);
        }

        // Store global reference
        window.currentUser = {
            mobile,
            adminId,
            role,
            roleDisplay,
            displayName,
            firstName,
            lastName
        };

        debugLog('✅ User data loaded and displayed successfully');
        debugLog('='.repeat(50));

    } catch (error) {
        debugError('Error displaying user info:', error);
        displayLoadingError();
    }
}

/**
 * Verify session with backend
 */
async function verifySessionWithBackend() {
    try {
        debugLog('Verifying session with backend...');

        // Use API_BASE_URL from common.js (global scope)
        const baseUrl = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:8086';

        const response = await fetch(`${baseUrl}/api/admin/get-all-admin`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        debugLog('Backend response status:', response.status);

        if (response.ok) {
            debugLog('✅ Backend session valid');

            const userData = JSON.parse(localStorage.getItem('hrms_user') || '{}');

           

            localStorage.setItem('hrms_logged_in', 'true');
            localStorage.setItem('hrms_user', JSON.stringify(userData));


            displayUserInfo(userData);
            return;
        }

        debugLog('❌ Backend session invalid (status ' + response.status + ')');
        redirectToLogin();

    } catch (error) {
        debugError('Error verifying session:', error);
        redirectToLogin();
    }
}

function redirectToLogin() {
    debugLog('Redirecting to login...');
    localStorage.clear();
    setTimeout(() => {
        window.location.href = '/index.html';
    }, 500);
}

/**
 * Display loading error state
 */
function displayLoadingError(message = 'Failed to load user data') {
    debugError('Displaying error state:', message);

    const elements = [
        { id: 'userName', text: message },
        { id: 'userRole', text: 'Click to login' },
        { id: 'menuUserName', text: message },
        { id: 'menuUserMobile', text: 'N/A' }
    ];

    elements.forEach(({ id, text }) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    });

    setTimeout(() => {
        debugLog('Redirecting to login due to error...');
        window.location.href = '/index.html';
    }, 3000);
}

// ========== LOGOUT FUNCTIONALITY ==========

async function performLogout() {
    try {
        debugLog('Performing logout...');

        const baseUrl = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:8086';

        const response = await fetch(`${baseUrl}/api/admin/auth/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        debugLog('Logout response status:', response.status);
    } catch (e) {
        debugError('Logout fetch error:', e);
    }

    debugLog('Clearing localStorage and sessionStorage...');
    localStorage.clear();
    sessionStorage.clear();

    debugLog('✅ Logout complete - Redirecting to login');
    window.location.href = '/index.html';
}

// ========== DROPDOWN INITIALIZATION ==========

function initHeaderComponents() {
    debugLog('Initializing header components...');

    const notificationBtn = document.getElementById('notificationBtn');
    const notificationMenu = document.getElementById('notificationMenu');
    const userBtn = document.getElementById('userBtn');
    const userMenu = document.getElementById('userMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutModal = document.getElementById('logoutModal');
    const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');

    // Notification button
    if (notificationBtn && notificationMenu) {
        const newBtn = notificationBtn.cloneNode(true);
        notificationBtn.parentNode.replaceChild(newBtn, notificationBtn);
        newBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationMenu.classList.toggle('show');
            userMenu?.classList.remove('show');
        });
        debugLog('✅ Notification button initialized');
    }

    // User button
    if (userBtn && userMenu) {
        const newBtn = userBtn.cloneNode(true);
        userBtn.parentNode.replaceChild(newBtn, userBtn);
        newBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('show');
            notificationMenu?.classList.remove('show');
        });
        debugLog('✅ User button initialized');
    }

    // Close dropdowns on document click
    document.addEventListener('click', () => {
        notificationMenu?.classList.remove('show');
        userMenu?.classList.remove('show');
    });

    // Logout button
    if (logoutBtn) {
        const newBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newBtn, logoutBtn);
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (logoutModal) logoutModal.style.display = 'flex';
            userMenu?.classList.remove('show');
        });
        debugLog('✅ Logout button initialized');
    }

    // Cancel logout
    if (cancelLogoutBtn) {
        const newBtn = cancelLogoutBtn.cloneNode(true);
        cancelLogoutBtn.parentNode.replaceChild(newBtn, cancelLogoutBtn);
        newBtn.addEventListener('click', () => {
            if (logoutModal) logoutModal.style.display = 'none';
        });
    }

    // Confirm logout
    if (confirmLogoutBtn) {
        const newBtn = confirmLogoutBtn.cloneNode(true);
        confirmLogoutBtn.parentNode.replaceChild(newBtn, confirmLogoutBtn);
        newBtn.addEventListener('click', performLogout);
    }

    // Modal overlay close
    const overlay = document.querySelector('.logout-modal-overlay');
    if (overlay) {
        const newOverlay = overlay.cloneNode(true);
        overlay.parentNode.replaceChild(newOverlay, overlay);
        newOverlay.addEventListener('click', () => {
            if (logoutModal) logoutModal.style.display = 'none';
        });
    }

    debugLog('✅ All header components initialized');
}

// ========== SIDEBAR OBSERVER ==========

function initSidebarObserver() {
    const observer = new MutationObserver(updateHeaderPosition);
    const sidebar = document.querySelector('.main-sidebar');
    if (sidebar) {
        observer.observe(sidebar, { attributes: true });
        updateHeaderPosition();
    }

    window.addEventListener('sidebarToggled', updateHeaderPosition);
}

// ========== INITIALIZATION ==========

/**
 * Main initialization function - called by common.js
 */
function initHeader() {
    debugLog('initHeader() called');

    initHeaderComponents();
    initSidebarObserver();
    loadUserData();
}

// ========== EXPORT FOR DEBUGGING ==========

window.headerDebug = {
    getAllCookies,
    getCookie: (name) => getAllCookies()[name],
    getLocalStorage: () => Object.keys(localStorage).reduce((obj, key) => {
        obj[key] = localStorage.getItem(key);
        return obj;
    }, {}),
    reloadUserData: loadUserData,
    verifyBackend: verifySessionWithBackend,
    performLogout
};

debugLog('Header.js loaded - Debug object available as window.headerDebug');