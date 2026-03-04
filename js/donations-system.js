document.addEventListener('DOMContentLoaded', () => {
    const mainGrid = document.getElementById('dynamic-charity-grid');
    const homeGrid = document.getElementById('home-donation-grid');

    if (!mainGrid && !homeGrid) return;

    function initDonations() {
        // Load Causes from LocalStorage (Preview) or Data File
        let currentCauses = [];
        const savedCauses = localStorage.getItem('workbridge_donation_causes');

        if (savedCauses) {
            currentCauses = JSON.parse(savedCauses);
        } else if (window.donationCausesData) {
            currentCauses = window.donationCausesData;
        }

        if (currentCauses.length > 0) {
            if (mainGrid) {
                renderCauses(mainGrid, currentCauses, false);
            }
            if (homeGrid) {
                // Only show 3 items on homepage
                renderCauses(homeGrid, currentCauses.slice(0, 3), true);
            }
        } else if (window.donationCausesData === undefined) {
            // If data file hasn't loaded yet, try again in 500ms
            setTimeout(initDonations, 500);
        }
    }

    initDonations();

    function renderCauses(container, causes, isHomepage) {
        container.innerHTML = causes.map(item => {
            const fundedPercent = Math.min(Math.round((item.raised / item.goal) * 100), 100);
            const badgeStyle = getBadgeStyle(item.category);
            const causeTitle = item.title.replace(/'/g, "\\'");

            // Button logic: On home page link to donations.html with cause, otherwise open modal directly
            const donateAction = isHomepage
                ? `window.location.href='donations.html?cause=${encodeURIComponent(item.title)}'`
                : `openDonationModal('${causeTitle}')`;

            return `
                <article class="charity-card reveal">
                    <img src="${item.image}" alt="${item.title}" class="charity-image">
                    <div class="charity-body">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <span class="badge" style="background: ${badgeStyle.bg}; color: ${badgeStyle.color};">${item.category}</span>
                            <span style="font-size: 0.8rem; color: var(--text-secondary);">${fundedPercent}% Funded</span>
                        </div>
                        <h3 class="charity-title">${item.title}</h3>
                        <p class="charity-desc">${item.description}</p>
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${fundedPercent}%;"></div>
                            </div>
                            <div class="progress-stats">
                                <span>Raised: Rs ${item.raised.toLocaleString()}</span>
                                <span>Goal: Rs ${item.goal.toLocaleString()}</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.8rem;">
                            <button class="btn-donate" onclick="${donateAction}"
                                style="flex: 1;">Donate Now</button>
                            <button class="btn-share"
                                onclick="shareContent('Charity: ${causeTitle}', 'Help WorkBridge Foundation support this cause.', window.location.origin + '/donations.html?cause=' + encodeURIComponent('${item.title}'))"
                                title="Share Cause">
                                <i class="fa-solid fa-share-nodes"></i>
                            </button>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    }

    function getBadgeStyle(category) {
        switch (category) {
            case 'Urgent': return { bg: '#fee2e2', color: '#ef4444' };
            case 'Ongoing': return { bg: '#dcfce7', color: '#166534' };
            case 'Critical': return { bg: '#fef3c7', color: '#92400e' };
            case 'Completed': return { bg: '#f1f5f9', color: '#64748b' };
            default: return { bg: '#eff6ff', color: '#3b82f6' };
        }
    }
});
