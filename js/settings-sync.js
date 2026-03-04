window.syncSettingsUI = function () {
    // Load Global Settings
    const savedSettings = localStorage.getItem('workbridge_settings');
    const settings = savedSettings ? JSON.parse(savedSettings) : {};

    // Apply WhatsApp Number to all WhatsApp buttons
    if (settings.whatsapp) {
        const whatsappButtons = document.querySelectorAll('.btn-whatsapp, .whatsapp-link');
        whatsappButtons.forEach(btn => {
            // Check if it's a button or an anchor
            if (btn.tagName === 'A') {
                btn.href = `https://wa.me/${settings.whatsapp}`;
            } else {
                btn.onclick = () => window.open(`https://wa.me/${settings.whatsapp}`, '_blank');
            }
        });
    }

    // Apply Site Name
    if (settings.siteName) {
        const siteNames = document.querySelectorAll('.site-name-dynamic');
        siteNames.forEach(el => {
            el.textContent = settings.siteName;
        });
    }

    // Apply Social Media Links
    const socialPlatforms = [
        { key: 'socialFb', id: 'social-fb', bg: '#1877f2' },
        { key: 'socialIg', id: 'social-ig', bg: '#e4405f' },
        { key: 'socialTw', id: 'social-tw', bg: '#000000' },
        { key: 'socialLi', id: 'social-li', bg: '#0a66c2' },
        { key: 'socialTk', id: 'social-tk', bg: '#000000' },
        { key: 'socialYt', id: 'social-yt', bg: '#ff0000' }
    ];

    socialPlatforms.forEach(platform => {
        const elements = document.querySelectorAll(`.${platform.id}, #${platform.id}`);
        if (settings[platform.key] && settings[platform.key].trim() !== '') {
            elements.forEach(el => {
                el.href = settings[platform.key];
                el.style.display = 'flex'; // Ensure it's visible
                el.style.alignItems = 'center';
                el.style.justifyContent = 'center';
                // If it's a footer icon, we might want to ensure background is set
                if (el.parentElement.classList.contains('footer-social')) {
                    el.style.background = platform.bg;
                }
            });
        } else {
            // Hide elements if no link is provided
            elements.forEach(el => {
                el.style.display = 'none';
            });
        }
    });

    // Apply Payment Accounts (Donations & Premium)
    const paymentFields = ['bankName', 'accTitle', 'accNum', 'easypaisa', 'jazzcash', 'paypal', 'binance'];
    const prefixes = ['inv', 'don'];

    // Sync prefixed elements (e.g., dynamic-inv-bank-name)
    prefixes.forEach(prefix => {
        paymentFields.forEach(field => {
            const key = prefix + field.charAt(0).toUpperCase() + field.slice(1); // e.g., invBankName
            if (settings[key]) {
                const elements = document.querySelectorAll(`.dynamic-${prefix}-${field.toLowerCase()}, #dynamic-${prefix}-${field.toLowerCase()}`);
                elements.forEach(el => {
                    updateElementValue(el, settings[key], prefix);
                });
            }
        });
    });

    // Helper to update element value and copy logic
    function updateElementValue(el, value, syncKey) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.value = value;
        } else {
            el.textContent = value;
        }

        // Update copy logic if present
        if (el.hasAttribute('onclick') && el.getAttribute('onclick').includes('copyText')) {
            el.setAttribute('onclick', `copyText('${value}')`);
        }
    }

    // Sync un-prefixed elements (backward compatibility / legacy)
    const legacyMap = {
        bankName: 'dynamic-bank-name',
        accTitle: 'dynamic-acc-title',
        accNum: 'dynamic-acc-num',
        easypaisa: 'dynamic-easypaisa',
        jazzcash: 'dynamic-jazzcash'
    };

    Object.keys(legacyMap).forEach(key => {
        // Use inv settings as default for legacy if available, otherwise check old settings
        const value = settings['inv' + key.charAt(0).toUpperCase() + key.slice(1)] || settings[key];
        if (value) {
            const elements = document.querySelectorAll(`.${legacyMap[key]}, #${legacyMap[key]}`);
            elements.forEach(el => {
                updateElementValue(el, value, key);
            });
        }
    });

    // Special case for copy buttons that are next to the text
    const copyButtons = document.querySelectorAll('[data-copy-sync]');
    copyButtons.forEach(btn => {
        const key = btn.getAttribute('data-copy-sync');
        // Check invKey, donKey, then Key
        const value = settings['inv' + key.charAt(0).toUpperCase() + key.slice(1)] ||
            settings['don' + key.charAt(0).toUpperCase() + key.slice(1)] ||
            settings[key];
        if (value) {
            btn.setAttribute('onclick', `copyText('${value}')`);
        }
    });

    // Special Case: Hero Ad Sync
    const heroAdLink = document.getElementById('hero-ad-link');
    const heroAdTitle = document.getElementById('hero-ad-title');
    const heroAdText = document.getElementById('hero-ad-text');

    if (heroAdLink && settings.whatsapp) {
        // Use the global WhatsApp number if no specific link is provided
        const adLink = settings.heroAdLink || `https://wa.me/${settings.whatsapp}?text=I%20want%20to%20learn%20more%20about%20promotion`;
        heroAdLink.setAttribute('onclick', `window.open('${adLink}', '_blank')`);

        if (settings.heroAdTitle) heroAdTitle.textContent = settings.heroAdTitle;
        if (settings.heroAdText) heroAdText.textContent = settings.heroAdText;
    }

    // Special Case: Video Ad Sync
    const videoSection = document.getElementById('home-video-ad-section');
    const videoContainer = document.getElementById('video-ad-container');
    const videoTitle = document.getElementById('video-ad-title');
    const videoDesc = document.getElementById('video-ad-desc');
    const videoFooter = document.querySelector('.video-ad-footer');

    if (settings.videoActive) {
        if (videoSection) videoSection.style.display = 'block';
        if (videoTitle) videoTitle.innerHTML = `<i class="fa-solid fa-star"></i> ${settings.videoTitle || 'Premium Promotion'}`;
        if (videoDesc) videoDesc.textContent = settings.videoDesc || 'Promote your business here to reach thousands of daily visitors.';

        if (videoContainer) {
            if (settings.videoUrl) {
                if (settings.videoUrl.includes('youtube.com') || settings.videoUrl.includes('youtu.be')) {
                    let embedUrl = settings.videoUrl;
                    if (!embedUrl.includes('embed/')) {
                        const videoId = settings.videoUrl.split('v=')[1] || settings.videoUrl.split('/').pop();
                        embedUrl = `https://www.youtube.com/embed/${videoId.split('&')[0]}?autoplay=0&mute=1`;
                    }
                    videoContainer.innerHTML = `<iframe width="100%" height="100%" src="${embedUrl}" frameborder="0" allowfullscreen style="border: none;"></iframe>`;
                } else if (settings.videoUrl.endsWith('.mp4') || settings.videoUrl.endsWith('.webm')) {
                    videoContainer.innerHTML = `<video controls style="width: 100%; height: 100%; object-fit: cover;"><source src="${settings.videoUrl}" type="video/mp4"></video>`;
                } else {
                    videoContainer.innerHTML = `<div class="video-placeholder-content"><i class="fa-solid fa-play"></i><p>Click below to watch the promotion</p></div>`;
                }
            } else {
                // Placeholder when active but no video
                videoContainer.innerHTML = `
                    <div class="video-placeholder-content">
                        <i class="fa-solid fa-bullhorn"></i>
                        <p>Your Ad Video Here</p>
                        <small>Contact us for paid promotion</small>
                    </div>`;
            }
        }

        if (videoFooter) {
            const defaultPromo = "https://wa.me/923489353023?text=I%20want%20to%20buy%20a%20video%20ad%20on%20WorkBridge";
            const promoLink = settings.videoLink || defaultPromo;
            const buttonText = settings.videoLink ? 'Visit Promoter Website' : 'Promote Your Business Here';

            videoFooter.innerHTML = `
                <a href="${promoLink}" target="_blank" class="btn-ad-click">
                    ${buttonText} <i class="fa-solid fa-external-link"></i>
                </a>
                <div class="video-ad-badge" style="margin-top:1rem; font-size:0.75rem; color:var(--text-secondary); font-weight:700; text-transform:uppercase;">
                    <i class="fa-solid fa-circle-check" style="color:#10b981"></i> Verified Promotion
                </div>`;
        }
    } else {
        if (videoSection) videoSection.style.display = 'block';
    }
});
