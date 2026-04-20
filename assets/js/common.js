// Common JS - Global Functions

// Get base path dynamically based on current page location
function getBasePath() {
    const path = window.location.pathname;
    
    // Check for deep nested pages (pages/reports/)
    if (path.includes('/pages/reports/')) {
        return '../../';
    }
    // Check for payroll folder
    else if (path.includes('/pages/payroll/')) {
        return '../../';
    }
    // Check for company-mgmt folder
    else if (path.includes('/company-mgmt/')) {
        return '../../';
    }
    // Check for pages folder
    else if (path.includes('/pages/')) {
        return '../';
    }
    // Root level
    return './';
}

// Load sidebar from includes folder
function loadSidebar() {
    const basePath = getBasePath();
    const sidebarPath = basePath + 'includes/sidebar.html';
    console.log('Loading sidebar from:', sidebarPath);
    
    fetch(sidebarPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Sidebar not found at: ' + sidebarPath);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;
            // Re-initialize sidebar after loading
            setTimeout(() => {
                if (typeof initSidebar === 'function') {
                    initSidebar();
                }
            }, 150);
        })
        .catch(error => {
            console.error('Error loading sidebar:', error);
            // Fallback: try alternative paths
            const altPaths = ['../includes/sidebar.html', './includes/sidebar.html', '/includes/sidebar.html'];
            tryAlternativePaths(altPaths, 0, 'sidebar-container', 'initSidebar');
        });
}

// Load header from includes folder
function loadHeader() {
    const basePath = getBasePath();
    const headerPath = basePath + 'includes/header.html';
    console.log('Loading header from:', headerPath);
    
    fetch(headerPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Header not found at: ' + headerPath);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            setTimeout(() => {
                if (typeof initHeader === 'function') {
                    initHeader();
                }
            }, 150);
        })
        .catch(error => {
            console.error('Error loading header:', error);
            const altPaths = ['../includes/header.html', './includes/header.html', '/includes/header.html'];
            tryAlternativePaths(altPaths, 0, 'header-container', 'initHeader');
        });
}

// Try alternative paths for loading
function tryAlternativePaths(paths, index, containerId, initFunction) {
    if (index >= paths.length) {
        console.error('All paths failed for:', containerId);
        document.getElementById(containerId).innerHTML = '<div class="text-red-500 p-4 text-center">Failed to load component. Please refresh the page.</div>';
        return;
    }
    
    fetch(paths[index])
        .then(response => {
            if (!response.ok) throw new Error();
            return response.text();
        })
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
            setTimeout(() => {
                if (typeof window[initFunction] === 'function') {
                    window[initFunction]();
                }
            }, 150);
        })
        .catch(() => {
            tryAlternativePaths(paths, index + 1, containerId, initFunction);
        });
}

// Show notification toast
function showNotification(message, type = 'success') {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 flex items-center gap-2 text-sm`;
    toast.style.backgroundColor = colors[type];
    toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Get current time
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Set active menu based on current page
function setActiveMenu(moduleName) {
    setTimeout(() => {
        const allNavLinks = document.querySelectorAll('.nav-link');
        allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-module') === moduleName) {
                link.classList.add('active');
            }
        });
    }, 300);
}