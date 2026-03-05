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
        'user-profile.html',
        'earning-dashboard.html',
        'post-job.html',
        'post-service.html'
    ];

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const user = JSON.parse(localStorage.getItem('workbridge_user'));

    // 1. Check if user is logged in for protected/admin pages
    if (!user) {
        if (adminPages.includes(currentPage) || protectedPages.includes(currentPage)) {
            console.warn('Access denied: User not logged in. Redirecting to landing page...');
            window.location.href = 'index.html?auth=required';
            return;
        }
    } else {
        // 2. Redirect logged-in users from landing page to platform (home.html)
        if (currentPage === 'index.html' || currentPage === '') {
            window.location.href = 'home.html';
            return;
        }

        // 3. Check Role-based access for Admin pages
        if (adminPages.includes(currentPage)) {
            if (user.role !== 'admin' || user.email.toLowerCase() !== 'maasif0922@gmail.com') {
                console.error('Access denied: Unauthorized admin access attempt.');
                window.location.href = 'user-profile.html?error=unauthorized';
                return;
            }
        }
    }

    // Handle UI updates based on Auth state
    document.addEventListener('DOMContentLoaded', () => {
        const authNav = document.querySelectorAll('.nav-links a, .nav-links button');
        const user = JSON.parse(localStorage.getItem('workbridge_user'));

        if (user) {
            // User is logged in
            authNav.forEach(link => {
                const text = link.textContent.trim().toLowerCase();
                if (text === 'login' || text === 'sign in' || text === 'join' || text === 'register') {
                    link.innerHTML = `<i class="fa-solid fa-user"></i> ${user.name.split(' ')[0]}`;
                    link.href = user.role === 'admin' ? 'dashboard.html' : 'user-profile.html';
                    link.onclick = null; // Remove openLoginModal click
                }
            });

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

    // Helper to check if page is index.html and needs to show login from direct redirect
    if (currentPage === 'index.html' || currentPage === '') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('auth') === 'required') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    if (typeof window.openLoginModal === 'function') {
                        window.openLoginModal();
                        const modalSubtitle = document.getElementById('auth-modal-subtitle');
                        if (modalSubtitle) modalSubtitle.textContent = 'Please log in or sign up to continue.';
                    }
                }, 500);
            });
        }
    }
})();
