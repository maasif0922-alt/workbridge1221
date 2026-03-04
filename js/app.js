// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // If active, ensure visibility (compatibility fix)
            if (navLinks.classList.contains('active')) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.backgroundColor = 'var(--surface-color)';
                navLinks.style.padding = '1.5rem';
                navLinks.style.zIndex = '1000';
                navLinks.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            } else {
                navLinks.style.display = '';
            }
        });

        // Auto-close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                    navLinks.style.display = '';
                }
            });
        });
    }

    // Initialize Global Navbar
    if (typeof renderNavbar === 'function') {
        renderNavbar();
    }

    // Handle Form submission simply for demo
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Optional: add visual feedback
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
                setTimeout(() => {
                    btn.innerHTML = '<i class="fa-solid fa-check"></i> Success';
                    setTimeout(() => btn.innerHTML = originalText, 2000);
                }, 1000);
            }
        });
    });

    // Theme Switcher Logic
    const themes = ['light', 'dark', 'sunset', 'emerald'];
    let currentThemeIndex = 0;
    const themeBtn = document.getElementById('themeToggleBtn');

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            const newTheme = themes[currentThemeIndex];

            // If light, remove data-theme to fallback to root variables
            if (newTheme === 'light') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', newTheme);
            }

            // Add a little pop effect to the button
            themeBtn.style.transform = 'scale(0.8)';
            setTimeout(() => themeBtn.style.transform = '', 150);
        });
    }

    // Scroll Reveal Animation (Intersection Observer)
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length > 0) {
        const revealConfig = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Once revealed, stop observing to keep it visible
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, revealConfig);
        reveals.forEach(reveal => revealObserver.observe(reveal));
    }

    // Hero Image Slider Logic
    const slides = document.querySelectorAll('.hero-image-slider .slide');
    const bgSlides = document.querySelectorAll('.hero-bg-slider .bg-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    let slideIndex = 0;
    let slideInterval;

    if (slides.length > 0) {
        const showSlide = (index) => {
            slides.forEach(s => s.classList.remove('active'));
            if (bgSlides.length > 0) bgSlides.forEach(b => b.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));

            slideIndex = index;
            if (slideIndex >= slides.length) slideIndex = 0;
            if (slideIndex < 0) slideIndex = slides.length - 1;

            slides[slideIndex].classList.add('active');
            if (bgSlides.length > 0) bgSlides[slideIndex].classList.add('active');
            dots[slideIndex].classList.add('active');
        };

        const nextSlide = () => {
            showSlide(slideIndex + 1);
        };

        // Attach to window so onclick="currentSlide(n)" works
        window.currentSlide = (index) => {
            showSlide(index);
            resetInterval();
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 4000); // Change image every 4 seconds
        };

        // Start slider
        resetInterval();
    }

    // Dynamic Navbar Login/Logout Toggle
    updateNavbar();
});

function updateNavbar() {
    const user = JSON.parse(localStorage.getItem('workbridge_user'));
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    // Find the login link
    const loginLink = Array.from(navLinks.querySelectorAll('a')).find(a =>
        a.textContent.trim().toLowerCase() === 'login' ||
        a.getAttribute('onclick')?.includes('openLoginModal')
    );

    if (user) {
        if (loginLink) {
            loginLink.innerHTML = `<i class="fa-solid fa-user"></i> ${user.name.split(' ')[0]}`;
            loginLink.href = user.role === 'admin' ? './dashboard.html' : './user-profile.html';
            loginLink.onclick = null; // Remove modal trigger
        }

        // Only add Logout if not already present
        const existingLogout = navLinks.querySelector('.logout-item');
        if (!existingLogout) {
            const logoutHtml = `<a href="javascript:void(0)" onclick="handleLogout()" class="dynamic-nav-item logout-item"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>`;
            navLinks.insertAdjacentHTML('beforeend', logoutHtml);
        }
    } else {
        // If logged out, ensure login link is visible
        if (loginLink) {
            loginLink.style.display = 'inline-block';
            loginLink.innerHTML = 'Login';
            loginLink.href = 'javascript:void(0)';
            loginLink.onclick = () => window.openLoginModal();
        }
        // Remove logout if present
        const existingLogout = navLinks.querySelector('.logout-item');
        if (existingLogout) existingLogout.remove();
    }
}

// Search Tabs Switcher
let activeSearchTab = 'jobs';

const searchCategories = {
    'jobs': [
        { value: '', text: 'All Job Categories' },
        { value: 'electrician', text: 'Electrician Jobs' },
        { value: 'driver', text: 'Driver Jobs' },
        { value: 'mason', text: 'Mason Jobs' },
        { value: 'data-entry', text: 'Data Entry Jobs' },
        { value: 'graphic-design', text: 'Graphic Design Jobs' },
        { value: 'video-editing', text: 'Video Editing Jobs' },
        { value: 'typing', text: 'Typing Jobs' },
        { value: 'helper', text: 'Helper Jobs' }
    ],
    'services': [
        { value: '', text: 'All Services' },
        { value: 'electrician', text: 'Electrical Services' },
        { value: 'driver', text: 'Driving Services' },
        { value: 'mason', text: 'Masonry Services' },
        { value: 'data-entry', text: 'Data Entry Services' },
        { value: 'graphic-design', text: 'Design Services' },
        { value: 'video-editing', text: 'Video Services' },
        { value: 'typing', text: 'Typing Services' },
        { value: 'helper', text: 'Helper / Labor' }
    ]
};

function switchWizardTab(tab) {
    activeSearchTab = tab;
    const tabs = document.querySelectorAll('.wizard-tabs .tab-btn');
    const input = document.getElementById('home-search-input');

    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'jobs') {
        tabs[0].classList.add('active');
        if (input) input.placeholder = 'e.g. Electrician, Data Entry...';
    } else {
        tabs[1].classList.add('active');
        if (input) input.placeholder = 'e.g. Graphic Design, Plumbing...';
    }

    updateSearchCategories(tab);

    // Jump back to step 1 when tab is changed
    nextWizardStep(1);
}

function updateSearchCategories(tab) {
    const categorySelect = document.getElementById('home-search-category');
    if (!categorySelect) return;

    categorySelect.innerHTML = '';
    const categories = searchCategories[tab] || [];

    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.value;
        option.textContent = cat.text;
        categorySelect.appendChild(option);
    });
}

function nextWizardStep(step) {
    const steps = [1, 2, 3];
    steps.forEach(s => {
        const el = document.getElementById(`wizard-step-${s}`);
        const dot = document.getElementById(`dot-${s}`);
        if (el) el.style.display = 'none';
        if (dot) dot.classList.remove('active');
    });

    const activeEl = document.getElementById(`wizard-step-${step}`);
    const activeDot = document.getElementById(`dot-${step}`);
    if (activeEl) {
        activeEl.style.display = 'block';
        activeEl.style.animation = 'fadeInUp 0.4s ease forwards';
    }
    if (activeDot) activeDot.classList.add('active');
}

// Home Page Wizard Search Handling
function submitWizardSearch() {
    const searchInput = document.getElementById('home-search-input');
    const categoryInput = document.getElementById('home-search-category');
    const countryInput = document.getElementById('home-search-country');
    const locationInput = document.getElementById('home-search-location');

    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const searchCategory = categoryInput ? categoryInput.value : '';
    const searchCountry = countryInput ? countryInput.value : '';
    const searchLocation = locationInput ? locationInput.value : '';

    // If a specific category was selected from dropdown, prioritize it
    const activeSearchKey = searchCategory !== '' ? searchCategory : searchTerm;

    if (activeSearchKey.includes('electric') || activeSearchKey.includes('wiring') || activeSearchKey.includes('bijli')) {
        window.location.href = 'category-electrician.html';
        return;
    }
    if (searchTerm.includes('drive') || searchTerm.includes('car') || searchTerm.includes('transport')) {
        window.location.href = 'category-driver.html';
        return;
    }
    if (activeSearchKey.includes('mason') || activeSearchKey.includes('build') || activeSearchKey.includes('mistry')) {
        window.location.href = 'category-mason.html';
        return;
    }
    if (activeSearchKey.includes('data') || activeSearchKey.includes('excel') || activeSearchKey.includes('entry')) {
        window.location.href = 'category-data-entry.html';
        return;
    }
    if (activeSearchKey.includes('graphic') || activeSearchKey.includes('design') || activeSearchKey.includes('logo')) {
        window.location.href = 'category-graphic-design.html';
        return;
    }
    if (activeSearchKey.includes('video') || activeSearchKey.includes('edit')) {
        window.location.href = 'category-video-editing.html';
        return;
    }
    if (activeSearchKey.includes('typ') || activeSearchKey.includes('word')) {
        window.location.href = 'category-typing.html';
        return;
    }
    if (activeSearchKey.includes('help') || activeSearchKey.includes('labor') || activeSearchKey.includes('mazdoor')) {
        window.location.href = 'category-helper.html';
        return;
    }

    if (activeSearchTab === 'jobs') {
        window.location.href = 'jobs.html';
    } else {
        window.location.href = 'services.html';
    }
}


// Job Filtering & Search Logic
let currentJobFilter = 'all';

function filterJobs(filter, btn) {
    currentJobFilter = filter;

    // Handle tab active state
    const tabs = document.querySelectorAll('#job-filters .tab-btn');
    if (tabs.length > 0) {
        tabs.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
    }

    applyJobFilters();
}

function searchJobs() {
    applyJobFilters();
}

function applyJobFilters() {
    const titleInput = document.getElementById('job-search-title');
    const locationInput = document.getElementById('job-search-location');

    const searchTitle = titleInput ? titleInput.value.toLowerCase() : '';
    const searchLocation = locationInput ? locationInput.value.toLowerCase() : '';

    const jobCards = document.querySelectorAll('.job-card');
    jobCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const location = card.querySelector('.card-subtitle').textContent.toLowerCase();
        const jobType = card.dataset.jobType;

        const matchesTitle = title.includes(searchTitle);
        const matchesLocation = searchLocation === '' || location.includes(searchLocation);
        const matchesTab = (currentJobFilter === 'all') || (jobType === currentJobFilter);

        if (matchesTitle && matchesLocation && matchesTab) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Service Filtering & Search Logic
let currentServiceFilter = 'all';

function filterServices(filter, btn) {
    currentServiceFilter = filter;

    // Handle tab active state
    const tabs = document.querySelectorAll('#service-filters .tab-btn');
    if (tabs.length > 0) {
        tabs.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
    }

    applyServiceFilters();
}

function searchServices() {
    applyServiceFilters();
}

function applyServiceFilters() {
    const titleInput = document.getElementById('service-search-title');

    const searchTitle = titleInput ? titleInput.value.toLowerCase() : '';

    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();

        const serviceType = card.dataset.serviceType;

        const matchesTitle = title.includes(searchTitle);
        const matchesTab = (currentServiceFilter === 'all') || (serviceType === currentServiceFilter);

        if (matchesTitle && matchesTab) {
            card.style.display = 'block'; // Service cards are blocks
        } else {
            card.style.display = 'none';
        }
    });
}

// Dynamic City Population Logic
const countryCities = {
    'pakistan': ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Quetta', 'Multan', 'Faisalabad'],
    'india': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'],
    'uae': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah'],
    'saudi': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam'],
    'uk': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Edinburgh'],
    'usa': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    'australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
    'canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa']
};

function updateCities() {
    const countrySelect = document.getElementById('home-search-country');
    const citySelect = document.getElementById('home-search-location');

    if (!countrySelect || !citySelect) return;

    const selectedCountry = countrySelect.value;
    const cities = countryCities[selectedCountry] || [];

    // Clear current options
    citySelect.innerHTML = '<option value="">All Cities</option>';

    // Add new options
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.toLowerCase().replace(/\s+/g, '-');
        option.textContent = city;
        citySelect.appendChild(option);
    });

    // Add remote option at the end
    const remoteOption = document.createElement('option');
    remoteOption.value = 'remote';
    remoteOption.textContent = 'Remote';
    citySelect.appendChild(remoteOption);
}

// Freelancer Filtering & Search Logic
let currentFreelancerFilter = 'all';

function filterFreelancers(filter, btn) {
    currentFreelancerFilter = filter;

    // Handle tab active state
    const tabs = document.querySelectorAll('#freelancer-filters .tab-btn');
    if (tabs.length > 0) {
        tabs.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
    }

    applyFreelancerFilters();
}

function searchFreelancers() {
    applyFreelancerFilters();
}

function applyFreelancerFilters() {
    const titleInput = document.getElementById('freelancer-search-title');

    const searchString = titleInput ? titleInput.value.toLowerCase() : '';

    const freelancerCards = document.querySelectorAll('.freelancer-card');
    freelancerCards.forEach(card => {
        const name = card.querySelector('.card-title').textContent.toLowerCase();
        const skill = card.querySelector('.card-subtitle').textContent.toLowerCase();

        // Let's also search location that might be in body
        const bodies = card.querySelectorAll('.card-subtitle');
        let loc = '';
        bodies.forEach(b => {
            if (b.innerHTML.includes('fa-location-dot')) {
                loc = b.textContent.toLowerCase();
            }
        });

        const freelancerType = card.dataset.freelancerType;

        const matchesSearch = name.includes(searchString) || skill.includes(searchString) || loc.includes(searchString);
        const matchesTab = (currentFreelancerFilter === 'all') || (freelancerType === currentFreelancerFilter);

        if (matchesSearch && matchesTab) {
            card.style.display = 'block'; // Freelancer cards are blocks
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize cities on load if elements exist
document.addEventListener('DOMContentLoaded', () => {
    updateCities();

    // Initialize search categories based on default active tab
    if (document.getElementById('home-search-category')) {
        updateSearchCategories('jobs');
    }

    const user = JSON.parse(localStorage.getItem('workbridge_user'));
    let buttonHtml = '';

    if (user) {
        const profileStatus = user.profileStatus || 'none';
        const isApproved = profileStatus === 'approved';

        buttonHtml = `
            <a href="javascript:void(0)" id="global-create-post-btn" class="floating-btn" style="text-decoration: none; display: ${isApproved ? 'block' : 'none'};">
                <i class="fa-solid fa-plus-circle"></i> Create Post
            </a>
            <a href="user-profile.html" class="floating-btn" style="text-decoration: none; background: #64748b; display: ${isApproved ? 'none' : 'block'};">
                <i class="fa-solid fa-user-plus"></i> Create Profile
            </a>
        `;

        // Update Nav Links if "Login" exists
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            const loginLink = Array.from(navLinks.querySelectorAll('a')).find(a => a.textContent.toLowerCase().includes('login'));
            if (loginLink) {
                loginLink.outerHTML = `
                    <div class="user-avatar-nav" onclick="window.location.href='user-profile.html'" style="cursor: pointer; background: var(--primary-color); color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;">
                        ${(user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                `;
            }
        }
    } else {
        buttonHtml = `
            <button id="global-create-post-btn" class="floating-btn" onclick="openLoginModal()">
                <i class="fa-solid fa-plus"></i> Create Post
            </button>
        `;
    }

    const modalHtml = `
        <div id="post-modal" class="modal">
            <div class="modal-content" style="max-width: 500px; padding: 2.5rem;">
                <span class="close-modal" id="close-post-modal">&times;</span>
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="width: 60px; height: 60px; background: rgba(37, 99, 235, 0.1); color: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.5rem;">
                        <i class="fa-solid fa-plus"></i>
                    </div>
                    <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">What would you like to post?</h2>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">Choose an option to reach thousands of users.</p>
                </div>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <a href="post-job.html" class="btn btn-primary" style="padding: 1rem; border-radius: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 12px; text-decoration: none;">
                        <i class="fa-solid fa-briefcase"></i> Post a Job (Hire)
                    </a>
                    <a href="post-service.html" class="btn" style="padding: 1rem; border-radius: 12px; font-weight: 700; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; gap: 12px; text-decoration: none; color: var(--text-primary); transition: all 0.2s;">
                        <i class="fa-solid fa-hand-holding-hand"></i> Offer a Service (Freelance)
                    </a>
                </div>
            </div>
        </div>

        <!-- Application Modal -->
        <div id="application-modal" class="modal">
            <div class="modal-content" style="max-width: 500px; padding: 2.5rem;">
                <span class="close-modal" id="close-app-modal">&times;</span>
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="width: 60px; height: 60px; background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.5rem;">
                        <i class="fa-solid fa-paper-plane"></i>
                    </div>
                    <h2 id="app-modal-title" style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">Apply for Job</h2>
                    <p id="app-modal-subtitle" style="color: var(--text-secondary); font-size: 0.9rem;">Send a professional message to the recruiter.</p>
                </div>
                <form id="application-form">
                    <input type="hidden" id="app-post-id">
                    <input type="hidden" id="app-post-title">
                    <input type="hidden" id="app-target-email">
                    <input type="hidden" id="app-type">
                    
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-primary);">Your Message</label>
                        <textarea id="app-message" class="form-control" style="width: 100%; padding: 1rem; border: 1px solid var(--border-color); border-radius: 12px; min-height: 120px; font-family: inherit;" placeholder="Briefly describe why you are a good fit..." required></textarea>
                    </div>
                    <button type="submit" id="submit-app-btn" class="btn btn-primary" style="width: 100%; padding: 1rem; border-radius: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px;">
                        Submit Application <i class="fa-solid fa-check-circle"></i>
                    </button>
                </form>
            </div>
        </div>
    `;

    const premiumModalHtml = `
        <div id="premium-modal" class="modal">
            <div class="modal-content" style="max-width: 500px; padding: 2.5rem;">
                <span class="close-modal" id="close-premium-modal">&times;</span>
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="width: 60px; height: 60px; background: rgba(245, 158, 11, 0.1); color: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.8rem;">
                        <i class="fa-solid fa-crown"></i>
                    </div>
                    <h2 id="premium-plan-title" style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">Premium Plan</h2>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">Upgrade your account to unlock all features.</p>
                </div>
                
                <div style="background: #f8fafc; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; border: 1px solid var(--border-color);">
                    <h3 style="font-size: 1rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-building-columns"></i> Payment Accounts
                    </h3>
                    <div style="display: flex; flex-direction: column; gap: 0.8rem; font-size: 0.9rem;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--text-secondary);">JazzCash/Easypaisa:</span>
                            <strong class="dynamic-inv-jazzcash">03489353023</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--text-secondary);">Bank Account:</span>
                            <strong class="dynamic-inv-bankname">UBL Bank</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--text-secondary);">Acc Number:</span>
                            <strong class="dynamic-inv-accnum">PK2601010497948</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--text-secondary);">Account Title:</span>
                            <strong class="dynamic-inv-acctitle">Muhammad Asif</strong>
                        </div>
                    </div>
                </div>

                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">After payment, send your screenshot to our WhatsApp for activation.</p>
                    <a href="https://wa.me/923489353023" id="premium-whatsapp-btn" target="_blank" class="btn btn-whatsapp" style="width: 100%; padding: 1rem; border-radius: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; text-decoration: none;">
                        <i class="fa-brands fa-whatsapp"></i> Send Payment Proof 
                    </a>
                </div>
                
                <p style="font-size: 0.75rem; text-align: center; color: var(--text-secondary);">Plan will be activated within 1-2 hours of verification.</p>
            </div>
        </div>
    `;

    // Inject Modals into body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.body.insertAdjacentHTML('beforeend', premiumModalHtml);

    // Inject Button into navbar after logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.insertAdjacentHTML('afterend', buttonHtml);
    }

    // Modal Logic
    const modal = document.getElementById("post-modal");

    // Expose Modal function
    window.openPostModal = () => {
        const user = JSON.parse(localStorage.getItem('workbridge_user'));
        if (!user) {
            openLoginModal();
            return;
        }
        if (user.profileStatus !== 'approved') {
            window.location.href = 'user-profile.html';
            return;
        }
        modal.style.display = "flex";
    };

    // Add event listener to ALL global create post buttons
    const postBtns = document.querySelectorAll("#global-create-post-btn");
    postBtns.forEach(pbtn => {
        pbtn.onclick = (e) => {
            e.preventDefault();
            window.openPostModal();
        }
    });

    const closePostBtn = document.getElementById("close-post-modal");
    if (closePostBtn) {
        closePostBtn.onclick = () => modal.style.display = "none";
    }

    // Application Modal Global Event Listeners
    const appModal = document.getElementById("application-modal");
    const closeAppBtn = document.getElementById("close-app-modal");
    if (closeAppBtn) {
        closeAppBtn.onclick = () => appModal.style.display = "none";
    }

    const closePremiumBtn = document.getElementById("close-premium-modal");
    if (closePremiumBtn) {
        closePremiumBtn.onclick = () => document.getElementById("premium-modal").style.display = "none";
    }

    const appForm = document.getElementById("application-form");
    if (appForm) {
        appForm.onsubmit = (e) => {
            e.preventDefault();
            submitApplication();
        };
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
        if (event.target == appModal) {
            appModal.style.display = "none";
        }
        if (event.target == document.getElementById("premium-modal")) {
            document.getElementById("premium-modal").style.display = "none";
        }
    }
});
// Dynamic Post Rendering & Social Features
function renderDynamicPosts(containerId, filterType = 'all', showPending = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const posts = JSON.parse(localStorage.getItem('workbridge_posts') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('workbridge_user'));

    // Filter posts
    let filteredPosts = posts.filter(post => {
        const isApproved = post.status === 'approved';
        const isOwnPost = currentUser && post.userId === currentUser.email;

        if (showPending) return isOwnPost; // On profile, show all own posts
        return isApproved; // On public feed, only show approved
    });

    if (filterType !== 'all') {
        filteredPosts = filteredPosts.filter(p => p.type === filterType || p.id.startsWith(filterType));
    }

    if (filteredPosts.length === 0) {
        if (!showPending) {
            // Don't show anything if no approved posts on main feed
            return;
        } else {
            container.innerHTML = '<p style="text-align:center; padding: 2rem; color: var(--text-secondary);">No posts found.</p>';
            return;
        }
    }

    // Sort by date (newest first)
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const html = filteredPosts.map(post => {
        const isJob = post.id.startsWith('job');
        const badgeClass = isJob ? 'badge-wage' : 'badge-remote';
        const iconClass = isJob ? 'fa-briefcase' : 'fa-hand-holding-hand';

        // Fiverr-style Verification Badge
        const verificationBadge = post.userVerified
            ? `<span class="badge-verified"><i class="fa-solid fa-circle-check"></i> Verified</span>`
            : `<span class="badge-non-verified"><i class="fa-solid fa-clock"></i> Non-verified</span>`;

        return `
            <div class="card reveal active" data-id="${post.id}">
                <div class="card-body" style="padding: 1.25rem;">
                    <div class="job-card-header" style="margin-bottom: 1rem;">
                        <div class="job-icon"><i class="fa-solid ${iconClass}"></i></div>
                        <div style="flex: 1;">
                            <h3 class="card-title" style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin: 0;">
                                ${post.title}
                                ${verificationBadge}
                            </h3>
                            <div class="card-subtitle" style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem; display: flex; align-items: center; gap: 8px;">
                                <img src="${post.userImg || 'https://ui-avatars.com/api/?name=' + post.userName}" style="width: 20px; height: 20px; border-radius: 50%;">
                                <div>
                                    Posted by <a href="profile-view.html?email=${post.userId}" style="color: var(--primary-color); text-decoration: none; font-weight: 700;">${post.userName}</a> 
                                    <span style="color: var(--text-secondary); font-weight: 500;">(${post.userTitle || 'Professional'})</span>
                                    • ${post.location || 'Remote'}
                                </div>
                            </div>
                        </div>
                        ${post.status === 'pending' ? '<span class="badge" style="background: #fef08a; color: #854d0e;">Pending</span>' : ''}
                    </div>
                    
                    <p style="font-size: 0.95rem; margin-bottom: 1rem; color: var(--text-primary); line-height: 1.5;">
                        ${post.description.length > 120 ? post.description.substring(0, 120) + '...' : post.description}
                    </p>

                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                        <span class="badge ${badgeClass}"><i class="fa-solid fa-tag"></i> ${post.type || (isJob ? 'Job' : 'Service')}</span>
                        <span class="badge" style="background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-secondary);">
                            <i class="fa-solid fa-eye"></i> ${post.views || 0} Views
                        </span>
                    </div>

                    <div class="card-meta" style="border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 0.5rem;">
                        <div class="price" style="font-size: 1.1rem; font-weight: 700; color: var(--primary-color);">
                            ${post.salary || post.price ? 'Rs ' + (post.salary || post.price) : 'Negotiable'}
                        </div>
                        <div class="time-ago" style="font-size: 0.8rem;"><i class="fa-regular fa-clock"></i> ${timeSince(new Date(post.date))}</div>
                    </div>
                </div>
                <div class="card-footer" style="padding: 1rem; background: rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 0.8rem;">
                    <div style="display: flex; gap: 0.5rem; width: 100%;">
                        <button onclick="likePost('${post.id}')" class="btn btn-like" data-id="${post.id}" style="flex: 1; padding: 0.6rem; font-size: 0.85rem; background: white; border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 8px;">
                            <i class="${currentUser && post.likedBy && post.likedBy.includes(currentUser.email) ? 'fa-solid' : 'fa-regular'} fa-thumbs-up" style="${currentUser && post.likedBy && post.likedBy.includes(currentUser.email) ? 'color: var(--primary-color);' : ''}"></i> <span>${post.likes || 0}</span>
                        </button>
                        <button onclick="openComments('${post.id}')" class="btn" style="flex: 1; padding: 0.6rem; font-size: 0.85rem; background: white; border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 8px;">
                            <i class="fa-regular fa-comment"></i> <span>${post.comments ? post.comments.length : 0}</span>
                        </button>
                        ${showPending && isOwnPost ? `
                            <button onclick="deletePost('${post.id}')" class="btn" style="padding: 0.6rem; background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; border-radius: 8px;" title="Delete Post">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        ` : `
                            <button onclick="sharePost('${post.id}', '${post.title.replace(/'/g, "\\'")}')" class="btn" style="padding: 0.6rem; background: white; border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 8px;">
                                <i class="fa-solid fa-share-nodes"></i>
                            </button>
                        `}
                    </div>
                    <div style="display: flex; gap: 0.5rem; width: 100%;">
                        <button onclick="applyToPost('${post.id}', this)" class="btn btn-primary" style="flex: 2; padding: 0.7rem; font-size: 0.9rem; font-weight: 600;">
                            <i class="fa-solid fa-paper-plane"></i> Apply Now
                        </button>
                        <a href="${getWhatsAppLink(post.contact, `Hi, I am interested in your ${isJob ? 'job' : 'service'}: ${post.title}`)}" target="_blank" class="btn btn-whatsapp" style="flex: 1; padding: 0.7rem; display: flex; align-items: center; justify-content: center; text-decoration: none;">
                            <i class="fa-brands fa-whatsapp"></i> Contact
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.insertAdjacentHTML('afterbegin', html);
    // Increment views for approved posts shown on feed
    if (!showPending) {
        filteredPosts.forEach(p => incrementViews(p.id));
    }
}

function timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
}

function incrementViews(id) {
    const posts = JSON.parse(localStorage.getItem('workbridge_posts') || '[]');
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
        posts[index].views = (posts[index].views || 0) + 1;
        localStorage.setItem('workbridge_posts', JSON.stringify(posts));
    }
}

window.likePost = function (id) {
    const user = JSON.parse(localStorage.getItem('workbridge_user'));
    if (!user) {
        alert("Please login to like this post.");
        openLoginModal();
        return;
    }

    const posts = JSON.parse(localStorage.getItem('workbridge_posts') || '[]');
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
        const post = posts[index];
        if (!post.likedBy) post.likedBy = [];

        const userLikeIndex = post.likedBy.indexOf(user.email);
        const btn = document.querySelector(`.btn-like[data-id="${id}"]`);

        if (userLikeIndex === -1) {
            // Like
            post.likedBy.push(user.email);
            post.likes = post.likedBy.length;
            if (btn) {
                btn.innerHTML = `<i class="fa-solid fa-thumbs-up" style="color: var(--primary-color);"></i> <span>${post.likes}</span>`;
            }
        } else {
            // Unlike (Toggle back)
            post.likedBy.splice(userLikeIndex, 1);
            post.likes = post.likedBy.length;
            if (btn) {
                btn.innerHTML = `<i class="fa-regular fa-thumbs-up"></i> <span>${post.likes}</span>`;
            }
        }

        localStorage.setItem('workbridge_posts', JSON.stringify(posts));
    }
};

window.deletePost = function (id) {
    if (confirm("Are you sure you want to permanently delete this post?")) {
        const posts = JSON.parse(localStorage.getItem('workbridge_posts') || '[]');
        const filtered = posts.filter(p => p.id !== id);
        localStorage.setItem('workbridge_posts', JSON.stringify(filtered));
        location.reload(); // Refresh to update view
    }
};

// --- Global Utilities & Navbar ---

window.renderNavbar = function () {
    const user = JSON.parse(localStorage.getItem('workbridge_user'));
    const isLanding = document.body.classList.contains('landing-page');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Build Nav Links
    let navHtml = '';
    if (user) {
        const isAdmin = user.role === 'admin';
        navHtml = `
            <a href="home.html" class="${currentPage === 'home.html' ? 'active' : ''}">Home</a>
            <a href="services.html" class="${currentPage === 'services.html' ? 'active' : ''}">Services</a>
            <a href="profiles.html" class="${currentPage === 'profiles.html' ? 'active' : ''}">Freelancers</a>
            <a href="jobs.html" class="${currentPage === 'jobs.html' ? 'active' : ''}">Jobs</a>
            <a href="donations.html" class="${currentPage === 'donations.html' ? 'active' : ''}">Donation</a>
            <a href="earning-dashboard.html" class="${currentPage === 'earning-dashboard.html' ? 'active' : ''}">Earning</a>
            ${isAdmin ? `<a href="dashboard.html" class="${currentPage === 'dashboard.html' ? 'active' : ''} nav-admin-link">Dashboard</a>` : ''}
            <div class="user-profile-nav" style="display: flex; align-items: center; gap: 0.8rem; margin-left: 1rem;">
                <a href="${isAdmin ? 'dashboard.html' : 'user-profile.html'}" style="padding: 0; display: flex; align-items: center; gap: 8px;">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--primary-color);">
                    <span style="font-weight: 600; font-size: 0.9rem;">${user.name.split(' ')[0]}</span>
                </a>
                <button onclick="handleLogout()" class="btn-logout-small" title="Logout" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; padding: 5px;">
                    <i class="fa-solid fa-right-from-bracket"></i>
                </button>
            </div>
        `;
    } else if (isLanding) {
        navHtml = `
            <a href="#about" style="color: inherit; font-weight: 600;">How it Works</a>
            <a href="#pathways" style="color: inherit; font-weight: 600;">Freelancers</a>
            <a href="javascript:void(0)" onclick="openLoginModal()" style="color: inherit; font-weight: 600;">Sign In</a>
            <button onclick="openLoginModal(); switchAuthTab('signup')" class="btn btn-primary" style="padding: 0.6rem 1.5rem; border-radius: 10px; font-weight: 700;">Join</button>
        `;
    } else {
        navHtml = `
            <a href="index.html">Home</a>
            <a href="javascript:void(0)" onclick="openLoginModal()">Login</a>
            <button onclick="openLoginModal(); switchAuthTab('signup')" class="btn btn-primary">Join Free</button>
        `;
    }

    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.innerHTML = navHtml;
    }

    // Also update logos
    document.querySelectorAll('.logo').forEach(logo => {
        logo.href = user ? 'home.html' : 'index.html';
    });
};

// Global fix for all WhatsApp links on page load
window.fixAllWhatsAppLinks = function () {
    const waButtons = document.querySelectorAll('.btn-whatsapp, a[href*="wa.me"]');
    waButtons.forEach(btn => {
        // If it's a generic link or needs admin fallback
        if (btn.href && (btn.href.includes('923012233445') || btn.href.includes('923000000000'))) {
            const settings = JSON.parse(localStorage.getItem('workbridge_settings') || '{}');
            const adminWA = settings.whatsapp || '923489353023';
            btn.href = btn.href.replace(/923012233445|923000000000|923000000001|923000000002|923000000003/, adminWA);
        }
    });
};

window.getWhatsAppLink = function (phone, message) {
    const settings = JSON.parse(localStorage.getItem('workbridge_settings') || '{}');
    const adminWA = settings.whatsapp || '923489353023';
    const finalPhone = phone || adminWA;
    return `https://wa.me/${finalPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message || 'Hi, I found your listing on WorkBridge.')}`;
};

// --- Professional Comment System ---

window.openComments = function (id) {
    const posts = JSON.parse(localStorage.getItem('workbridge_posts') || '[]');
    const post = posts.find(p => p.id === id);
    if (!post) return;

    // Create Modal if not exists
    let modal = document.getElementById('comments-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'comments-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px; padding: 0; overflow: hidden; border-radius: 20px;">
                <div style="padding: 1.5rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background: var(--bg-color);">
                    <h3 style="margin: 0;">Comments</h3>
                    <button onclick="document.getElementById('comments-modal').style.display='none'" style="background:none; border:none; font-size: 1.2rem; cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div id="comments-list" style="max-height: 400px; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;"></div>
                <div style="padding: 1rem; border-top: 1px solid var(--border-color); background: #f8fafc;">
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="new-comment-input" placeholder="Write a comment..." style="flex: 1; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 12px; font-family: inherit;">
                        <button onclick="submitComment('${id}')" class="btn btn-primary" style="padding: 0.8rem 1.2rem;"><i class="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    modal.style.display = 'flex';
    renderCommentsList(post);
};

function renderCommentsList(post) {
    const list = document.getElementById('comments-list');
    list.innerHTML = '';

    if (!post.comments || post.comments.length === 0) {
        list.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 2rem;">No comments yet. Be the first to reply!</div>`;
        return;
    }

    post.comments.forEach((c, idx) => {
        const commentDiv = document.createElement('div');
        commentDiv.style = "display: flex; gap: 12px; align-items: flex-start;";
        commentDiv.innerHTML = `
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(c.user)}&background=random" style="width: 32px; height: 32px; border-radius: 50%;">
            <div style="background: white; padding: 0.8rem; border-radius: 12px; border: 1px solid var(--border-color); flex: 1;">
                <div style="font-weight: 700; font-size: 0.85rem; margin-bottom: 2px;">${c.user}</div>
                <div style="font-size: 0.9rem; color: var(--text-primary);">${c.text}</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 5px;">${new Date(c.date).toLocaleDateString()}</div>
            </div>
        `;
        list.appendChild(commentDiv);
    });
    list.scrollTop = list.scrollHeight;
}

window.submitComment = function (postId) {
    const input = document.getElementById('new-comment-input');
    const text = input.value.trim();
    const user = JSON.parse(localStorage.getItem('workbridge_user'));

    if (!user) {
        alert("Please login to comment.");
        openLoginModal();
        return;
    }

    if (text) {
        const posts = JSON.parse(localStorage.getItem('workbridge_posts') || '[]');
        const idx = posts.findIndex(p => p.id === postId);
        if (idx !== -1) {
            if (!posts[idx].comments) posts[idx].comments = [];
            posts[idx].comments.push({
                user: user.name,
                email: user.email,
                text: text,
                date: new Date().toISOString()
            });
            localStorage.setItem('workbridge_posts', JSON.stringify(posts));
            input.value = '';
            renderCommentsList(posts[idx]);

            // Update UI count
            const countSpan = document.querySelector(`button[onclick="openComments('${postId}')"] span`);
            if (countSpan) countSpan.textContent = posts[idx].comments.length;
        }
    }
};

function sharePost(id, title) {
    const url = window.location.origin + window.location.pathname + '?post=' + id;
    if (navigator.share) {
        navigator.share({
            title: title,
            text: 'Check out this post on WorkBridge!',
            url: url
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback to copy link
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        });
    }
}

// Apply to Post Functionality
function applyToPost(postId, btn) {
    const user = JSON.parse(localStorage.getItem('workbridge_user'));
    if (!user) {
        alert("Please login to apply for this position.");
        openLoginModal();
        return;
    }

    // Check if user has already applied
    const applications = JSON.parse(localStorage.getItem('workbridge_applications') || '[]');
    const alreadyApplied = applications.find(app => app.postId === postId && app.userEmail === user.email);

    if (alreadyApplied) {
        alert("You have already applied for this position!");
        if (btn) {
            btn.innerHTML = 'Applied!';
            btn.disabled = true;
        }
        return;
    }

    // Support for static job cards with generic IDs
    let post = null;
    if (postId.startsWith('job_')) {
        post = {
            id: postId,
            title: postId.includes('graphic') ? 'Graphic Designer' : (postId.includes('electrician') ? 'Expert Electrician' : 'Professional'),
            userId: 'admin@workbridge.com' // Fallback for static demo posts
        };
    } else {
        const posts = JSON.parse(localStorage.getItem('workbridge_posts') || '[]');
        post = posts.find(p => p.id === postId);
    }

    if (!post) return;

    // Open Modal instead of immediate application
    const appModal = document.getElementById('application-modal');
    if (!appModal) return;

    document.getElementById('app-modal-title').textContent = 'Apply for ' + (post.title || 'Job');
    document.getElementById('app-modal-subtitle').textContent = 'Send a professional proposal to ' + (post.userName || 'the recruiter') + '.';
    document.getElementById('app-post-id').value = post.id;
    document.getElementById('app-post-title').value = post.title;
    document.getElementById('app-target-email').value = post.userId;
    document.getElementById('app-type').value = 'job_apply';
    document.getElementById('app-message').value = '';

    appModal.style.display = 'flex';

    // Store button reference to update after submission
    window.currentApplyBtn = btn;
}

function hireFreelancer(email, name, btn) {
    const user = JSON.parse(localStorage.getItem('workbridge_user'));
    if (!user) {
        alert("Please login to hire freelancers.");
        openLoginModal();
        return;
    }

    // Open Modal for hiring
    const appModal = document.getElementById('application-modal');
    if (!appModal) return;

    document.getElementById('app-modal-title').textContent = 'Hire ' + name;
    document.getElementById('app-modal-subtitle').textContent = 'Describe the service or task you want to hire for.';
    document.getElementById('app-post-id').value = 'hire_' + email.replace(/[@.]/g, '_');
    document.getElementById('app-post-title').value = 'Direct Hire: ' + name;
    document.getElementById('app-target-email').value = email;
    document.getElementById('app-type').value = 'freelancer_hire';
    document.getElementById('app-message').value = '';

    appModal.style.display = 'flex';
    window.currentApplyBtn = btn;
}

function submitApplication() {
    const user = JSON.parse(localStorage.getItem('workbridge_user'));
    const message = document.getElementById('app-message').value.trim();
    const postId = document.getElementById('app-post-id').value;
    const postTitle = document.getElementById('app-post-title').value;
    const targetEmail = document.getElementById('app-target-email').value;
    const type = document.getElementById('app-type').value;

    if (!message) {
        alert("Please enter a message.");
        return;
    }

    const btn = document.getElementById('submit-app-btn');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    // Simulate delay
    setTimeout(() => {
        // Record application
        const newApplication = {
            id: 'app_' + Date.now(),
            postId: postId,
            postTitle: postTitle,
            postUserEmail: targetEmail,
            userEmail: user.email,
            userName: user.name,
            message: message,
            type: type,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        const currentApps = JSON.parse(localStorage.getItem('workbridge_applications') || '[]');
        currentApps.push(newApplication);
        localStorage.setItem('workbridge_applications', JSON.stringify(currentApps));

        // Update activity
        const userActivity = JSON.parse(localStorage.getItem('user_activity') || '[]');
        userActivity.unshift({
            id: 'un_' + Date.now(),
            type: type === 'job_apply' ? 'apply' : 'hire',
            text: type === 'job_apply' ? `Applied for: ${postTitle}` : `Hired: ${postTitle}`,
            time: new Date().toISOString()
        });
        localStorage.setItem('user_activity', JSON.stringify(userActivity.slice(0, 10)));

        // Update the button that triggered the modal
        if (window.currentApplyBtn) {
            window.currentApplyBtn.innerHTML = '<i class="fa-solid fa-check"></i> ' + (type === 'job_apply' ? 'Applied!' : 'Proposal Sent!');
            window.currentApplyBtn.style.background = '#10b981';
            window.currentApplyBtn.disabled = true;
        }

        // Close modal and feedback
        document.getElementById('application-modal').style.display = 'none';
        btn.innerHTML = originalContent;
        btn.disabled = false;

        alert(`Your ${type === 'job_apply' ? 'application' : 'proposal'} has been sent successfully!`);
    }, 1200);
}

// Global Premium Modal function
window.openPremiumModal = function (planName, price) {
    const user = JSON.parse(localStorage.getItem('workbridge_user'));
    if (!user) {
        alert("Please login to join this plan.");
        openLoginModal();
        return;
    }

    const modal = document.getElementById('premium-modal');
    const titleEl = document.getElementById('premium-plan-title');
    const whatsappBtn = document.getElementById('premium-whatsapp-btn');
    const settings = JSON.parse(localStorage.getItem('workbridge_settings') || '{}');

    if (modal && titleEl) {
        titleEl.textContent = planName + ' ($' + price + ')';

        // Use global admin WhatsApp if available
        const adminWA = settings.whatsapp || '923489353023';
        const msg = encodeURIComponent(`I want to join the ${planName} ($${price}). My email: ${user.email}`);
        whatsappBtn.href = `https://wa.me/${adminWA}?text=${msg}`;

        modal.style.display = 'flex';

        // Re-sync dynamic bank details if sync script is active
        if (window.syncSettingsUI) window.syncSettingsUI();
    }
}

// Initialize dynamic content based on page
document.addEventListener('DOMContentLoaded', () => {
    // Determine which container to use
    if (document.getElementById('home-latest-jobs')) {
        renderDynamicPosts('home-latest-jobs', 'all');
    }
    if (document.getElementById('jobs-feed')) {
        renderDynamicPosts('jobs-feed', 'job');
    }
    if (document.getElementById('services-feed')) {
        renderDynamicPosts('services-feed', 'service');
    }
    if (document.getElementById('user-posts-container')) {
        renderDynamicPosts('user-posts-container', 'all', true);
    }
});

// Global Share Functionality
function shareContent(title, text, url) {
    const fullUrl = url || window.location.href;
    const shareData = {
        title: title || 'WorkBridge',
        text: text || 'Check this out on WorkBridge!',
        url: fullUrl
    };

    if (navigator.share) {
        navigator.share(shareData)
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    console.error('Error sharing:', err);
                }
            });
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(fullUrl).then(() => {
            alert('Link copied to clipboard! Share it with your friends.');
        }).catch(err => {
            console.error('Could not copy link:', err);
        });
    }
}

// --- Freelancer Directory System ---

const defaultFreelancers = [
    {
        name: "Ali Khan",
        title: "Expert Electrician",
        type: "home",
        location: "Islamabad, PK",
        rating: 4.8,
        description: "Specializing in residential wiring, fault finding, and AC installation.",
        email: "ali.khan@example.com",
        phone: "923000000000",
        verified: true
    },
    {
        name: "Sara Ahmed",
        title: "Graphic Designer",
        type: "tech",
        location: "Remote",
        rating: 5.0,
        description: "Creative branding, UI/UX, and marketing material designs.",
        email: "sara.ahmed@example.com",
        phone: "923000000001",
        verified: true
    },
    {
        name: "Zaid Hussain",
        title: "Plumber",
        type: "home",
        location: "Karachi, PK",
        rating: 4.0,
        description: "Pipe fittings, geyser installation, and leak repairs.",
        email: "zaid.hussain@example.com",
        phone: "923000000002",
        verified: true
    },
    {
        name: "Fatima Noor",
        title: "Content Writer",
        type: "writing",
        location: "Lahore, PK",
        rating: 4.7,
        description: "SEO articles, blog posts, and copy writing in Urdu and English.",
        email: "fatima.zahra@example.com",
        phone: "923000000003",
        verified: false
    }
];

window.renderFreelancers = function (filter = 'all', searchQuery = '') {
    const container = document.querySelector('.cards-grid');
    if (!container) return;

    const allFreelancers = [...defaultFreelancers];
    // In a real app, we'd also pull from localStorage users who marked themselves as freelancers

    const filtered = allFreelancers.filter(f => {
        const matchesType = filter === 'all' || f.type === filter;
        const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    container.innerHTML = filtered.map(f => `
        <div class="card freelancer-card" data-freelancer-type="${f.type}">
            <div class="card-header-flex">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(f.name)}&background=random" alt="${f.name}" class="avatar">
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; width: 100%;">
                        <h3 class="card-title">${f.name}</h3>
                        ${f.verified ? '<span class="badge-verified"><i class="fa-solid fa-circle-check"></i> Verified</span>' : ''}
                    </div>
                    <div class="card-subtitle">${f.title}</div>
                    <div class="rating">
                        ${'<i class="fa-solid fa-star"></i>'.repeat(Math.floor(f.rating))}
                        ${f.rating % 1 !== 0 ? '<i class="fa-solid fa-star-half-stroke"></i>' : ''}
                        <span>(${f.rating.toFixed(1)})</span>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">${f.description}</p>
                <div class="card-subtitle"><i class="fa-solid fa-location-dot"></i> ${f.location}</div>
            </div>
            <div class="card-footer" style="display: flex; gap: 0.5rem;">
                <div style="display: flex; flex-direction: column; gap: 0.5rem; flex: 1;">
                    <a href="${getWhatsAppLink(f.phone, `Hi ${f.name}, I found your profile on WorkBridge.`)}" target="_blank" class="btn btn-whatsapp" style="width: 100%; text-decoration: none;">
                        <i class="fa-brands fa-whatsapp"></i> WhatsApp Me
                    </a>
                    <a href="profile-view.html?email=${f.email}" class="btn" style="width: 100%; border: 1px solid var(--border-color); text-align: center; justify-content: center; text-decoration: none; display: flex; align-items: center;">View Full Profile</a>
                </div>
                <button class="btn-share" onclick="shareContent('${f.name} - ${f.title}', 'Hire this expert on WorkBridge!', window.location.href)" title="Share Profile">
                    <i class="fa-solid fa-share-nodes"></i>
                </button>
            </div>
        </div>
    `).join('');

    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-secondary);">No freelancers found matching your criteria.</div>`;
    }
};

window.searchFreelancers = function () {
    const query = document.getElementById('freelancer-search-title').value;
    renderFreelancers('all', query);
};

window.filterFreelancers = function (type, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderFreelancers(type);
};

// Update DOMContentLoaded to include freelancer rendering
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof renderNavbar === 'function') renderNavbar();
        if (typeof fixAllWhatsAppLinks === 'function') fixAllWhatsAppLinks();
        if (document.getElementById('freelancer-filters')) renderFreelancers();
    });
} else {
    if (typeof renderNavbar === 'function') renderNavbar();
    if (typeof fixAllWhatsAppLinks === 'function') fixAllWhatsAppLinks();
    if (document.getElementById('freelancer-filters')) renderFreelancers();
}
