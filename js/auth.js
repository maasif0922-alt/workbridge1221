/**
 * WorkBridge Authentication System
 * Handles login, logout, and session simulation
 */

// Profile Approval System Integration
// Make sure profile-approval.js is loaded before this file
if (typeof createApprovalRequest === 'undefined') {
    console.warn('profile-approval.js not loaded. Approval system will not work.');
}

// JWT Decoding Utility for Google Social Auth
function parseJwt(token) {
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

// Google Auth Callback Handler
window.handleCredentialResponse = function (response) {
    try {
        if (!response || !response.credential) {
            console.error('Invalid Google response');
            return;
        }

        const responsePayload = parseJwt(response.credential);
        if (!responsePayload || !responsePayload.email) {
            console.error('Failed to decode Google JWT');
            return;
        }

        console.log("ID: " + responsePayload.sub);
        console.log('Full Name: ' + responsePayload.name);
        console.log('Email: ' + responsePayload.email);

        // Show loading state in modal (optional, but good UX)
        const modalSubtitle = document.getElementById('auth-modal-subtitle');
        if (modalSubtitle) modalSubtitle.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating with Google...';

        setTimeout(() => {
                const email = responsePayload.email;
            // fallback to email local part if name missing
            const name = responsePayload.name || email.split('@')[0];
            const role = email.toLowerCase() === 'maasif0922@gmail.com' ? 'admin' : 'user';
            const isVerified = (role === 'admin');

            // Save mock session
            const userObj = {
                name: name,
                email: email,
                role: role,
                isVerified: isVerified,
                profileStatus: role === 'admin' ? 'approved' : 'pending',
                loginDate: new Date().toISOString(),
                method: 'google'
            };
            localStorage.setItem('workbridge_user', JSON.stringify(userObj));
                    console.log('Stored user in localStorage:', userObj);                    if (typeof renderNavbar === 'function') renderNavbar();            // Sync with all users list for admin visibility
            let allUsers = JSON.parse(localStorage.getItem('workbridge_all_users') || '[]');
            if (!allUsers.find(u => u.email === email)) {
                allUsers.push(userObj);
                localStorage.setItem('workbridge_all_users', JSON.stringify(allUsers));
            }

            // Create approval request for non-admin users
            if (role !== 'admin' && typeof createApprovalRequest === 'function') {
                createApprovalRequest(userObj);
                console.log('Approval request created for Google user:', email);
            }

            // Initialize earning profile if user
            if (role === 'user') {
                const existingProfile = localStorage.getItem('earning_profile');
                if (!existingProfile) {
                    localStorage.setItem('earning_profile', JSON.stringify({
                        points: 0,
                        earnings: 0,
                        activeTime: 0,
                        isTimerRunning: false,
                        completedTasks: 0,
                        joinDate: new Date().toISOString()
                    }));
                }
            }

            // Redirect
            if (role === 'admin') {
                window.location.href = './dashboard.html';
            } else {
                window.location.href = './home.html';
            }
        }, 1500);
    } catch (error) {
        console.error('Error handling Google credential response:', error);
        const modalSubtitle = document.getElementById('auth-modal-subtitle');
        if (modalSubtitle) modalSubtitle.innerHTML = 'Google sign-in encountered an error. Please use email/password instead.';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Hide Google sign-in elements on pages other than index.html
    if (!window.location.pathname.endsWith('index.html')) {
        document.querySelectorAll('#google-auth-container, .g_id_signin, #g_id_onload').forEach(el => {
            if (el) el.style.display = 'none';
        });
    }

    const loginForm = document.getElementById('login-form-element');
    const signupForm = document.getElementById('signup-form-element');

    // Add Signup Handler
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const phone = document.getElementById('signup-phone').value;
            const password = document.getElementById('signup-password').value;
            const btn = signupForm.querySelector('button[type="submit"]');

            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';
            btn.disabled = true;

            setTimeout(() => {
                if (email && password && name && phone) {
                    const countryCode = document.getElementById('signup-country-code')?.value || '';
                    const fullPhone = countryCode + phone;

                    btn.innerHTML = '<i class="fa-solid fa-check"></i> Account Created!';
                    btn.style.background = '#10b981';

                    const selectedPlan = localStorage.getItem('selected_earning_plan');

                    const role = email.toLowerCase() === 'maasif0922@gmail.com' ? 'admin' : 'user';
                    const isVerified = (role === 'admin');

                    const userData = {
                        name: name,
                        email: email,
                        phone: fullPhone,
                        role: role,
                        isVerified: isVerified,
                        profileStatus: 'approved', // Always approved for immediate login
                        earning_plan: selectedPlan || "Free Visitor Plan",
                        loginDate: new Date().toISOString()
                    };

                    localStorage.setItem('workbridge_user', JSON.stringify(userData));
                    console.log('Stored new signup user in localStorage:', userData);
                    if (typeof renderNavbar === 'function') renderNavbar();

                    // Add user to all users list and create approval request if not admin
                    let allUsers = JSON.parse(localStorage.getItem('workbridge_all_users') || '[]');
                    if (!allUsers.find(u => u.email === email)) {
                        allUsers.push(userData);
                        localStorage.setItem('workbridge_all_users', JSON.stringify(allUsers));
                    }

                    // Create approval request for non-admin users
                    if (role !== 'admin' && typeof createApprovalRequest === 'function') {
                        createApprovalRequest(userData);
                        console.log('Approval request created for new user:', email);
                    }

                    if (selectedPlan || !selectedPlan) {
                        // Always initialize earning profile for new users just in case
                        localStorage.setItem('earning_profile', JSON.stringify({
                            points: 0,
                            earnings: 0,
                            activeTime: 0,
                            isTimerRunning: false,
                            completedTasks: [],
                            joinDate: new Date().toISOString()
                        }));
                    }

                    setTimeout(() => {
                        if (email.toLowerCase() === 'maasif0922@gmail.com') {
                            window.location.href = './dashboard.html';
                        } else {
                            window.location.href = './home.html';
                        }
                        localStorage.removeItem('selected_earning_plan');
                    }, 1000);
                } else {
                    btn.innerHTML = '<i class="fa-solid fa-xmark"></i> Registration Failed';
                    btn.style.background = '#ef4444';
                    btn.disabled = false;
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                    }, 2000);
                }
            }, 1000);
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const loginBtn = loginForm.querySelector('button[type="submit"]');

            // Show loading state
            const originalText = loginBtn.innerHTML;
            loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
            loginBtn.disabled = true;

            // Simulation of API delay
            setTimeout(() => {
                // Mock authentication check
                // In a real app, this would be a fetch call to the backend
                if (email && password) {
                    // Success!
                    loginBtn.innerHTML = '<i class="fa-solid fa-check"></i> Welcome Back!';
                    loginBtn.style.background = '#10b981';

                    const selectedPlan = localStorage.getItem('selected_earning_plan');

                    // Save mock session
                    const role = email.toLowerCase() === 'maasif0922@gmail.com' ? 'admin' : 'user';
                    const isVerified = (role === 'admin');

                    localStorage.setItem('workbridge_user', JSON.stringify({
                        name: email.split('@')[0],
                        email: email,
                        role: role,
                        isVerified: isVerified,
                        profileStatus: 'approved', // Always approved for login
                        earning_plan: selectedPlan || null,
                        loginDate: new Date().toISOString()
                    }));
                    console.log('Stored manual login user in localStorage for', email);
                    if (typeof renderNavbar === 'function') renderNavbar();

                    // Only add to all users list if not already exists
                    let allUsers = JSON.parse(localStorage.getItem('workbridge_all_users') || '[]');
                    if (!allUsers.find(u => u.email === email)) {
                        const newUser = {
                            name: email.split('@')[0],
                            email: email,
                            role: role,
                            isVerified: isVerified,
                            profileStatus: 'approved', // Always approved
                            earning_plan: selectedPlan || null,
                            loginDate: new Date().toISOString()
                        };
                        allUsers.push(newUser);
                        localStorage.setItem('workbridge_all_users', JSON.stringify(allUsers));
                    }

                    // We will initialize the earning profile if they selected a plan
                    if (selectedPlan || role === 'user') {
                        const existingProfile = localStorage.getItem('earning_profile');
                        if (!existingProfile) {
                            localStorage.setItem('earning_profile', JSON.stringify({
                                points: 0,
                                earnings: 0,
                                activeTime: 0,
                                isTimerRunning: false, // Ensure timer only runs on the dashboard
                                completedTasks: 0,
                                joinDate: new Date().toISOString()
                            }));
                        }
                    }

                    // Redirect to appropriate dashboard
                    setTimeout(() => {
                        const timestamp = Date.now();
                        if (email.toLowerCase() === 'maasif0922@gmail.com') {
                            window.location.href = `dashboard.html?t=${timestamp}`;
                        } else {
                            window.location.href = `home.html?t=${timestamp}`;
                        }
                        localStorage.removeItem('selected_earning_plan');
                    }, 1000);
                } else {
                    // Error
                    loginBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> Invalid Credentials';
                    loginBtn.style.background = '#ef4444';
                    loginBtn.disabled = false;

                    setTimeout(() => {
                        loginBtn.innerHTML = originalText;
                        loginBtn.style.background = '';
                    }, 2000);
                }
            }, 1500);
        });
    }

    // Modal Global Handling
    window.openLoginModal = function () {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Stop scrolling
        }
    };

    window.registerForPlan = function (planName) {
        localStorage.setItem('selected_earning_plan', planName);
        window.openLoginModal();
        window.switchAuthTab('signup'); // Default to signup when registering for a plan
    };

    window.switchAuthTab = function (tab) {
        const loginForm = document.getElementById('login-form-element');
        const signupForm = document.getElementById('signup-form-element');
        const loginBtn = document.getElementById('tab-login-btn');
        const signupBtn = document.getElementById('tab-signup-btn');
        const modalTitle = document.getElementById('auth-modal-title');
        const modalSubtitle = document.getElementById('auth-modal-subtitle');

        if (!loginForm || !signupForm) return;

        if (tab === 'login') {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            if (loginBtn) {
                loginBtn.style.borderBottom = '2px solid var(--primary-color)';
                loginBtn.style.color = 'var(--primary-color)';
            }
            if (signupBtn) {
                signupBtn.style.borderBottom = '2px solid transparent';
                signupBtn.style.color = 'var(--text-secondary)';
            }
            if (modalTitle) modalTitle.textContent = 'Welcome Back';
            if (modalSubtitle) modalSubtitle.textContent = 'Sign in to access your dashboard.';
        } else {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
            if (signupBtn) {
                signupBtn.style.borderBottom = '2px solid var(--primary-color)';
                signupBtn.style.color = 'var(--primary-color)';
            }
            if (loginBtn) {
                loginBtn.style.borderBottom = '2px solid transparent';
                loginBtn.style.color = 'var(--text-secondary)';
            }
            if (modalTitle) modalTitle.textContent = 'Join WorkBridge';
            if (modalSubtitle) modalSubtitle.textContent = 'Create a new account to start earning.';
        }
    };

    window.closeLoginModal = function () {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Resume scrolling
        }
    };

    // Logout logic
    window.handleLogout = function () {
        console.log("Logging out user...");
        // Clear all session data
        localStorage.removeItem('workbridge_user');
        localStorage.removeItem('selected_earning_plan');
        localStorage.removeItem('earning_profile');
        localStorage.removeItem('user_activity');

        // Redirect to index
        window.location.href = 'index.html';
    };

    // --- OTP & Profile Verification Flow ---

    /**
     * Generates a 6-digit mock OTP and stores it for a user
     */
    window.sendWhatsAppOTP = function (userEmail, phoneNumber) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // In a real app, this would call a WhatsApp API (like Twilio or Meta Business API)
        console.log(`[MOCK WHATSAPP API] Sending OTP ${otp} to ${phoneNumber}`);

        // Store OTP temporarily in localStorage for verification
        const otps = JSON.parse(localStorage.getItem('workbridge_otps') || '{}');
        otps[userEmail] = {
            otp: otp,
            expiry: Date.now() + (5 * 60 * 1000) // 5 minutes expiry
        };
        localStorage.setItem('workbridge_otps', JSON.stringify(otps));

        return true;
    };

    /**
     * Verifies the OTP entered by the user
     */
    window.verifyWhatsAppOTP = function (userEmail, enteredOtp) {
        const otps = JSON.parse(localStorage.getItem('workbridge_otps') || '{}');
        const record = otps[userEmail];

        if (!record) return { success: false, message: "No OTP found for this user." };
        if (Date.now() > record.expiry) return { success: false, message: "OTP has expired." };

        // For testing/mocking purposes, we'll allow '123456' as a universal bypass
        if (enteredOtp === record.otp || enteredOtp === '123456') {
            // Remove OTP after successful use
            delete otps[userEmail];
            localStorage.setItem('workbridge_otps', JSON.stringify(otps));
            return { success: true };
        }

        return { success: false, message: "Invalid OTP. Please try again." };
    };

    // Close on overlay click
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) closeLoginModal();
        });
    }

    // Helper function to test login
    window.testLogin = function(email = 'test@example.com', password = 'test123') {
        // Save mock session
        const role = email.toLowerCase() === 'maasif0922@gmail.com' ? 'admin' : 'user';
        const isVerified = (role === 'admin');

        const userData = {
            name: email.split('@')[0],
            email: email,
            role: role,
            isVerified: isVerified,
            profileStatus: 'approved',
            earning_plan: null,
            loginDate: new Date().toISOString()
        };
        
        localStorage.setItem('workbridge_user', JSON.stringify(userData));
        
        // Redirect with a small delay to ensure localStorage is set
        setTimeout(() => {
            const timestamp = Date.now();
            if (role === 'admin') {
                window.location.href = `dashboard.html?t=${timestamp}`;
            } else {
                window.location.href = `home.html?t=${timestamp}`;
            }
        }, 500);
        
        return true;
    };
});
