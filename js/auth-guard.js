/**
 * WorkBridge Auth Guard
 * Protects routes and handles redirection based on user role
 */

(function () {
    // List of admin-only pages
    const adminPages = [
        'dashboard.html',
        'admin-ads.html',
        'admin-donation-posts.html',
        'admin-donations.html',
        'admin-events.html',
        'admin-investments.html',
        'admin-legal.html',
        'admin-news.html',
        'admin-tasks.html',
        'admin-video-ad.html',
        'settings.html'
    ];

    // List of user-only/protected pages (registered users)
    // pages that require authentication to access
    const protectedPages = [
        'home.html',
        'user-profile.html',
        'earning-dashboard.html',
        'post-job.html',
        'post-service.html',
        'profiles.html',
        'services.html',
        'news.html',
        'donations.html'
    ];

    let path = window.location.pathname;
    let currentPage = path.split('/').pop() || 'index.html';

    // Handle cases where there might be a trailing slash or directory access
    if (path.endsWith('/')) {
        currentPage = 'index.html';
    }

    const user = JSON.parse(localStorage.getItem('workbridge_user'));
    console.log('[AuthGuard] Running check for:', currentPage);
    console.log('[AuthGuard] User state:', user ? `Logged in as ${user.email} (${user.role})` : 'Not logged in');

    // 1. Check if user is logged in for protected/admin pages
    if (!user) {
        if (adminPages.includes(currentPage) || protectedPages.includes(currentPage)) {
            console.warn('[AuthGuard] Access denied: Protected page. Redirecting to landing...');
            window.location.href = 'index.html?auth=required';
            return;
        }
    } else {
        // 2. Redirect logged-in users from landing page to platform (home.html)
        if (currentPage === 'index.html' || currentPage === 'index') {
            console.log('[AuthGuard] Logged-in user on landing page. Redirecting to home.html...');
            window.location.href = 'home.html';
            return;
        }

        // 3. Check Role-based access for Admin pages
        if (adminPages.includes(currentPage)) {
            // Updated admin check to be more flexible if needed, but keeping user's specific requirement
            if (user.role !== 'admin' || user.email.toLowerCase() !== 'maasif0922@gmail.com') {
                console.error('[AuthGuard] Admin access denied. Insufficient permissions.');
                window.location.href = 'home.html?error=unauthorized';
                return;
            }
        }
    }

    // Handle UI updates based on Auth state
    document.addEventListener('DOMContentLoaded', () => {
        const user = JSON.parse(localStorage.getItem('workbridge_user'));
        console.log('[AuthGuard] DOM Loaded. User:', user ? user.email : 'None');

        if (user) {
            // Hide admin links from sidebar if on a page with a sidebar and user is NOT admin
            if (user.role !== 'admin') {
                const sidebarItems = document.querySelectorAll('.sidebar-item');
                sidebarItems.forEach(item => {
                    const href = item.getAttribute('href');
                    if (href && (href.startsWith('admin-') || href === 'dashboard.html' || href === 'settings.html')) {
                        item.style.display = 'none';
                    }
                });
            }
        }
    });

    // Handle index.html auth required prompt
    if (currentPage === 'index.html') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('auth') === 'required') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    if (typeof window.openLoginModal === 'function') {
                        console.log('[AuthGuard] Showing login modal due to auth requirement');
                        window.openLoginModal();
                        const modalSubtitle = document.getElementById('auth-modal-subtitle');
                        if (modalSubtitle) modalSubtitle.textContent = 'Please log in or sign up to continue.';
                    }
                }, 500);
            });
        }
    }
})();
