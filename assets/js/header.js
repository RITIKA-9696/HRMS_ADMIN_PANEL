// Header JS - Dropdown and Notification Logic with Logout Modal


function initHeader() {
    // Notification dropdown
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationMenu = document.getElementById('notificationMenu');
    
    if (notificationBtn && notificationMenu) {
        // Remove existing listeners to avoid duplicates
        const newNotificationBtn = notificationBtn.cloneNode(true);
        notificationBtn.parentNode.replaceChild(newNotificationBtn, notificationBtn);
        
        newNotificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationMenu.classList.toggle('show');
        });
    }
    
    // User dropdown
    const userBtn = document.getElementById('userBtn');
    const userMenu = document.getElementById('userMenu');
    
    if (userBtn && userMenu) {
        const newUserBtn = userBtn.cloneNode(true);
        userBtn.parentNode.replaceChild(newUserBtn, userBtn);
        
        newUserBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenu.classList.toggle('show');
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        const notifMenu = document.getElementById('notificationMenu');
        const usrMenu = document.getElementById('userMenu');
        if (notifMenu) notifMenu.classList.remove('show');
        if (usrMenu) usrMenu.classList.remove('show');
    });
    
    // ========== LOGOUT FUNCTIONALITY WITH MODAL ==========
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutModal = document.getElementById('logoutModal');
    const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
    
    if (logoutBtn) {
        // Remove existing listener to avoid duplicates
        const newLogoutBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
        
        newLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (logoutModal) logoutModal.style.display = 'flex';
            const userMenuElem = document.getElementById('userMenu');
            if (userMenuElem) userMenuElem.classList.remove('show');
        });
    }
    
    if (cancelLogoutBtn) {
        const newCancelBtn = cancelLogoutBtn.cloneNode(true);
        cancelLogoutBtn.parentNode.replaceChild(newCancelBtn, cancelLogoutBtn);
        
        newCancelBtn.addEventListener('click', function() {
            if (logoutModal) logoutModal.style.display = 'none';
        });
    }
    
    if (confirmLogoutBtn) {
        const newConfirmBtn = confirmLogoutBtn.cloneNode(true);
        confirmLogoutBtn.parentNode.replaceChild(newConfirmBtn, confirmLogoutBtn);
        
        newConfirmBtn.addEventListener('click', function() {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/index.html';
        });
    }
    
    // Close modal when clicking on overlay
    const overlay = document.querySelector('.logout-modal-overlay');
    if (overlay) {
        const newOverlay = overlay.cloneNode(true);
        overlay.parentNode.replaceChild(newOverlay, overlay);
        
        newOverlay.addEventListener('click', function() {
            if (logoutModal) logoutModal.style.display = 'none';
        });
    }
    
    // ========== UPDATE HEADER POSITION ON SIDEBAR TOGGLE ==========
    function updateHeaderPosition() {
        const sidebar = document.querySelector('.main-sidebar');
        const header = document.querySelector('.main-header');
        if (sidebar && header) {
            if (sidebar.classList.contains('collapsed')) {
                header.style.left = '70px';
            } else {
                header.style.left = '256px';
            }
        }
    }
    
    // Listen for custom event from sidebar
    window.addEventListener('sidebarToggled', function() {
        updateHeaderPosition();
    });
    
    // Also listen for storage events
    window.addEventListener('storage', function(e) {
        if (e.key === 'sidebarCollapsed') {
            updateHeaderPosition();
        }
    });
    
    // Mutation observer for sidebar class changes
    const sidebar = document.querySelector('.main-sidebar');
    if (sidebar) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    updateHeaderPosition();
                }
            });
        });
        observer.observe(sidebar, { attributes: true });
        updateHeaderPosition();
    }
}

// Initialize header when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initHeader();
    }, 150);
});