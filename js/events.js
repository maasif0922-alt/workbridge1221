document.addEventListener('DOMContentLoaded', () => {
    const eventWidgetContainer = document.getElementById('event-notice-hero');
    if (!eventWidgetContainer) return;

    const events = [
        {
            "id": "ramadan-2026",
            "active": true,
            "type": "ramadan",
            "title": "Ramadan Mubarak 2026",
            "startDate": "2026-02-18",
            "endDate": "2026-03-19",
            "message": "Is barkat mahine mein mustahiqeen ki madad karen aur ajar kamayein.",
            "ashras": [
                { "name": "Rehmat", "days": "1-10", "message": "Pehla Ashra: Allah ki Rehmat ka nuzool." },
                { "name": "Maghfirat", "days": "11-20", "message": "Dosra Ashra: Gunahon se Maafi aur Maghfirat." },
                { "name": "Nijat", "days": "21-30", "message": "Teesra Ashra: Jahannam se Nijat ka waqt." }
            ],
            "fazail": [
                "Ramadan is the month of the Quran.",
                "Fasting is a shield against evil.",
                "Lailat-ul-Qadr is better than a thousand months."
            ],
            "timings": { "city": "Lahore", "sehri": "04:52 AM", "iftari": "06:05 PM" },
            "images": [
                "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&q=80&w=600",
                "https://images.unsplash.com/photo-1591604021695-0c69b7c03314?auto=format&fit=crop&q=80&w=600",
                "https://images.unsplash.com/photo-1551041777-ed0763a19765?auto=format&fit=crop&q=80&w=600"
            ],
            "donations": [
                { "id": "dastarkhwan", "label": "Iftar Dastarkhwan", "description": "Feed a fasting worker for Rs. 300." },
                { "id": "zakat", "label": "Zakat-al-Mal", "description": "Helping those in need." }
            ]
        },
        {
            "id": "holi-2026",
            "active": false,
            "type": "festival",
            "title": "Happy Holi 2026",
            "startDate": "2026-03-03",
            "endDate": "2026-03-04",
            "message": "Celebrate the festival of colors by spreading joy and helping the community.",
            "images": [
                "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&q=80&w=600"
            ],
            "donations": [
                { "id": "holi-gift", "label": "Festival Joy", "description": "Gifts for worker communities." }
            ]
        },
        {
            "id": "eid-fitr-2026",
            "active": false,
            "type": "eid",
            "title": "Eid ul Fitr 2026",
            "startDate": "2026-03-20",
            "endDate": "2026-03-22",
            "message": "Celebrate Eid by sharing your happiness with those who work hard for us.",
            "images": [
                "https://images.unsplash.com/photo-1594246830573-047f3b60331f?auto=format&fit=crop&q=80&w=600"
            ],
            "donations": [
                { "id": "eid-gift", "label": "Eid Eidi", "description": "Special Eidi for workers' children." }
            ]
        },
        {
            "id": "eid-adha-2026",
            "active": false,
            "type": "eid",
            "title": "Eid al-Adha 2026",
            "startDate": "2026-05-27",
            "endDate": "2026-05-30",
            "message": "Share the blessing of Qurbani with deserving families through WorkBridge Foundation.",
            "images": [
                "https://images.unsplash.com/photo-1566453838084-7ec37e335694?auto=format&fit=crop&q=80&w=600"
            ],
            "donations": [
                { "id": "qurbani", "label": "Qurbani Share", "description": "Donate meat and meals to workers." }
            ]
        },
        {
            "id": "diwali-2026",
            "active": false,
            "type": "festival",
            "title": "Happy Diwali 2026",
            "startDate": "2026-11-08",
            "endDate": "2026-11-10",
            "message": "Spread light and happiness this Diwali. Support workers with special festival kits.",
            "images": [
                "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=600"
            ],
            "donations": [
                { "id": "diwali-kit", "label": "Diwali Gifts", "description": "Help workers celebrate with joy." }
            ]
        },
        {
            "id": "christmas-2026",
            "active": false,
            "type": "festival",
            "title": "Merry Christmas 2026",
            "startDate": "2026-12-24",
            "endDate": "2026-12-26",
            "message": "The season of giving! Share the joy of Christmas with our worker community.",
            "images": [
                "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=600"
            ],
            "donations": [
                { "id": "xmas-gift", "label": "Christmas Cheer", "description": "Gifts and meals for families." }
            ]
        }
    ];

    const aiInsights = [
        "Did you know? Fasting during Ramadan helps the body detoxify and improves mental clarity.",
        "Pro Tip: Stay hydrated between Iftar and Sehri by drinking at least 8 glasses of water.",
        "Spiritual Insight: Ramadan is not just about avoiding food, but also practicing patience and kindness.",
        "Health Tip: Eating dates at Iftar provides an immediate energy boost and essential minerals.",
        "Community Tip: Sharing your Iftar with a neighbor or a worker brings double rewards.",
        "Sunnah Tip: Keep your Sehri light and nutritious with complex carbs for sustained energy.",
        "Management Tip: Use your high-energy hours early in the day for your most difficult work tasks.",
        "AI Advice: Taking short 15-minute naps during the day can help maintain focus while fasting."
    ];

    const aiDonationMessages = [
        "Aapka chota sa sadqa kisi bhookay ka pait bhar sakta hai. Be a Ray of Hope.",
        "Your $5 can provide an Iftar kit for a worker's family. Let's share the blessings.",
        "Give a gift of education. Every rupee you donate builds a better future for a worker's child.",
        "Sadaqah removes calamities. Safeguard your family by helping those in need today.",
        "Be the reason someone smiles this Ramadan. Donate to our Foundation now.",
        "Emotional Tip: Helping a worker today is like planting a tree of reward for your hereafter.",
        "Transparent AI: 100% of your donation reaches the doorsteps of verified workers."
    ];

    const aiNewsItems = [
        "AI Prediction: Huge demand for Delivery Drivers expected in Dubai next month. Get ready!",
        "Platform Update: New 'Instant Pay' feature coming for verified freelancers soon.",
        "Did you know? WorkBridge profiles with a professional photo get 3x more job invites.",
        "Community Win: WorkBridge Foundation has served 5,000+ Iftar meals this week!",
        "Safety Alert: New AI-driven worker safety module is now live and protecting sites.",
        "Career Insight: Skilled Masons are currently the most searched profile in Riyadh."
    ];

    const cycleTickerContent = (wrapperId, contentArray, iconClass) => {
        const wrapper = document.getElementById(wrapperId);
        if (!wrapper) return;

        setInterval(() => {
            const randomMsg = contentArray[Math.floor(Math.random() * contentArray.length)];
            const newItem = document.createElement('a');
            newItem.href = wrapperId.includes('donation') ? "donations.html?cause=General%20Donation" : "news-detail.html";
            newItem.className = "ticker-item ai-generated";
            if (wrapperId.includes('donation')) {
                newItem.style.color = "white"; // White text for red background
            } else {
                newItem.style.color = "var(--primary-color)"; // Standard color for news
            }
            newItem.style.fontWeight = "800";
            newItem.innerHTML = `<i class="${iconClass}"></i> <span style="background: var(--primary-color); color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; margin-right: 5px;">AI</span> ${randomMsg}`;

            // Add to the end of the wrapper
            wrapper.appendChild(newItem);

            // Limit the number of items to prevent DOM bloat
            if (wrapper.children.length > 15) {
                wrapper.removeChild(wrapper.children[0]);
            }
        }, 15000); // Add a new AI item every 15 seconds
    };

    // Initialize Site-wide Ticker AI
    cycleTickerContent('donation-ticker-wrapper', aiDonationMessages, 'fa-solid fa-heart');
    cycleTickerContent('news-ticker-wrapper', aiNewsItems, 'fa-solid fa-robot');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let activeEvent = events.find(e => {
        const start = new Date(e.startDate);
        const end = new Date(e.endDate);
        return today >= start && today <= end;
    });

    let isUpcoming = false;
    if (!activeEvent) {
        // Find the nearest upcoming event
        const upcomingEvents = events
            .filter(e => new Date(e.startDate) > today)
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        if (upcomingEvents.length > 0) {
            activeEvent = upcomingEvents[0];
            isUpcoming = true;
        }
    }

    if (activeEvent) {
        renderEventWidget(activeEvent, isUpcoming);
    }

    function renderEventWidget(event, upcoming = false) {
        const isRamadan = event.type === 'ramadan';
        const isEid = event.type === 'eid';

        // Dynamic Icon Logic
        let eventIcon = 'fa-calendar-star';
        if (isRamadan) eventIcon = 'fa-moon';
        else if (isEid) eventIcon = 'fa-kaaba';
        else if (event.title.includes('Christmas')) eventIcon = 'fa-tree';
        else if (event.title.includes('Diwali')) eventIcon = 'fa-lightbulb';
        else if (event.title.includes('Holi')) eventIcon = 'fa-palette';

        let html = `
            <div id="event-widget" class="event-widget integrated-vertical ${upcoming ? 'upcoming-mode' : ''}" style="margin-top: 0; box-shadow: var(--shadow-lg);">
                <div class="event-header">
                    <h3><i class="fa-solid ${eventIcon}"></i> ${event.title}</h3>
                    ${upcoming ? `<div class="upcoming-badge">Coming Soon</div>` : ''}
                    <div class="ai-managed-badge" id="ai-assistant-trigger" title="Click for AI Insights">
                        <i class="fa-solid fa-robot"></i> <span>Ask AI</span>
                    </div>
                </div>
                <div class="event-body">
                    <div id="ai-insight-box" class="ai-insight-box">
                        <div class="ai-typing">
                            <span></span><span></span><span></span>
                        </div>
                        <div class="ai-insight-content"></div>
                    </div>

                    <div class="event-image-slider">
                        ${event.images.map((img, i) => `<img src="${img}" class="${i === 0 ? 'active' : ''}" alt="Event Image">`).join('')}
                    </div>
                    <p class="event-msg">${event.message}</p>
        `;

        if (isRamadan) {
            const today = new Date();
            const start = new Date(event.startDate);
            const timeDiff = today.getTime() - start.getTime();
            const dayOfRamadan = Math.max(1, Math.floor(timeDiff / (1000 * 3600 * 24)) + 1);

            const ashraIndex = dayOfRamadan <= 10 ? 0 : (dayOfRamadan <= 20 ? 1 : 2);

            html += `
                    <div class="ramadan-info">
                        <div class="ashra-info">
                            <span class="badge-ashra ${ashraIndex === 0 ? 'active' : ''}">${event.ashras[0].name}</span>
                            <span class="badge-ashra ${ashraIndex === 1 ? 'active' : ''}">${event.ashras[1].name}</span>
                            <span class="badge-ashra ${ashraIndex === 2 ? 'active' : ''}">${event.ashras[2].name}</span>
                        </div>
                        <div class="timings-box">
                            <div class="timing-item">
                                <span>Sehri</span>
                                <strong>${event.timings.sehri}</strong>
                            </div>
                            <div class="timing-item">
                                <span>Iftari</span>
                                <strong>${event.timings.iftari}</strong>
                            </div>
                        </div>
                        <p class="timing-city"><i class="fa-solid fa-location-dot"></i> ${event.timings.city}</p>
                        
                        ${event.fazail ? `
                            <div class="fazail-box">
                                <p class="fazail-title"><i class="fa-solid fa-star"></i> Ramadan Fazail</p>
                                <ul class="fazail-list">
                                    ${event.fazail.map(f => `<li class="fazail-item"><i class="fa-solid fa-circle-check"></i> <span>${f}</span></li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
            `;
        }

        html += `
                    <div class="donation-buttons">
                        <button class="btn-donate-main" id="main-donate-btn">Donate Now</button>
                        <div class="donation-options">
                            ${event.donations.map(d => `
                                <div class="donation-option-item" onclick="openDonationForm('${d.label}')">
                                    <i class="fa-solid fa-heart"></i>
                                    <span>${d.label}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Donation Form Modal -->
            <div id="eventDonationModal" class="modal-overlay">
                <div class="donation-modal">
                    <div class="modal-header">
                        <h2><i class="fa-solid fa-heart" style="color: #ef4444;"></i> Support <span id="selected-cause"></span></h2>
                        <button id="close-donation-modal" class="close-btn" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="event-donation-form">
                            <div class="form-group" style="margin-bottom: 1rem;">
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Full Name</label>
                                <input type="text" placeholder="Enter your name" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px;">
                            </div>
                            <div class="form-group" style="margin-bottom: 1rem;">
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Amount (Rs)</label>
                                <input type="number" placeholder="Enter amount" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px;">
                            </div>
                            <div class="form-group" style="margin-bottom: 1.5rem;">
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Payment Method</label>
                                <select required style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px;">
                                    <option value="easypaisa">EasyPaisa</option>
                                    <option value="jazzcash">JazzCash</option>
                                    <option value="bank">Bank Transfer</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem; border-radius: 8px; font-weight: 700;">Confirm Donation</button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        eventWidgetContainer.innerHTML = html;
        setupWidgetInteractions();
    }

    function setupWidgetInteractions() {
        const widget = document.getElementById('event-widget');
        const donationModal = document.getElementById('eventDonationModal');
        const closeDonationModal = document.getElementById('close-donation-modal');
        const mainDonateBtn = document.getElementById('main-donate-btn');
        const aiTrigger = document.getElementById('ai-assistant-trigger');
        const aiInsightBox = document.getElementById('ai-insight-box');
        const aiContent = aiInsightBox.querySelector('.ai-insight-content');
        const aiTyping = aiInsightBox.querySelector('.ai-typing');

        let aiCycleInterval;

        const showNextAIInsight = () => {
            aiInsightBox.classList.add('active');
            aiContent.style.display = 'none';
            aiTyping.style.display = 'flex';

            setTimeout(() => {
                let insightText = '';

                // AI Proactive Logic: Notify about upcoming events if close
                const upcomingEvents = events.filter(e => {
                    const diff = new Date(e.startDate) - today;
                    const daysAway = Math.ceil(diff / (1000 * 3600 * 24));
                    return daysAway > 0 && daysAway <= 14;
                });

                if (upcomingEvents.length > 0 && Math.random() > 0.6) {
                    const nextE = upcomingEvents[0];
                    const diff = new Date(nextE.startDate) - today;
                    const daysAway = Math.ceil(diff / (1000 * 3600 * 24));
                    insightText = `AI Notice: <b>${nextE.title}</b> is starting in ${daysAway} days (${nextE.startDate})! Get ready for the celebrations.`;
                } else {
                    insightText = aiInsights[Math.floor(Math.random() * aiInsights.length)];
                }

                aiTyping.style.display = 'none';
                aiContent.innerHTML = `<i class="fa-solid fa-quote-left"></i> ${insightText}`;
                aiContent.style.display = 'block';
            }, 1000);
        };

        // Automate AI Insights cycling (every 12 seconds)
        if (aiInsightBox) {
            showNextAIInsight();
            aiCycleInterval = setInterval(showNextAIInsight, 12000);
        }

        if (aiTrigger) {
            aiTrigger.onclick = () => {
                clearInterval(aiCycleInterval);
                showNextAIInsight();
                aiCycleInterval = setInterval(showNextAIInsight, 12000);
            };
        }

        if (mainDonateBtn) {
            mainDonateBtn.onclick = () => openDonationForm('General Donation');
        }

        closeDonationModal.onclick = () => donationModal.style.display = 'none';

        document.addEventListener('click', (event) => {
            if (event.target == donationModal) {
                donationModal.style.display = 'none';
            }
        });

        const form = document.getElementById('event-donation-form');
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();

                const donorName = form.querySelector('input[placeholder="Enter your name"]').value;
                const amount = form.querySelector('input[placeholder="Enter amount"]').value;
                const method = form.querySelector('select').value;
                const cause = document.getElementById('selected-cause').textContent;
                const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                // Save to pending donations (Centralized Storage)
                const pendingDonations = JSON.parse(localStorage.getItem('workbridge_pending_donations') || '[]');
                pendingDonations.push({
                    date: date,
                    name: donorName,
                    cause: cause + " (Event Widget)",
                    amount: "Rs. " + amount,
                    method: method.charAt(0).toUpperCase() + method.slice(1) + ' (Pending)',
                    status: 'Pending'
                });
                localStorage.setItem('workbridge_pending_donations', JSON.stringify(pendingDonations));

                // Get WhatsApp number from settings
                const settings = JSON.parse(localStorage.getItem('workbridge_settings') || '{}');
                const whatsapp = settings.whatsapp || '923489353023';

                const message = `JazakAllah! I have donated to the cause: *${cause}* (Event Widget).\n\n*Donation Details:*\n- Amount: Rs. ${amount}\n- Donor: ${donorName}\n- Method: ${method}\n\nI am sending the payment proof. Please confirm receipt.`;

                const waUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
                window.open(waUrl, '_blank');

                alert('JazakAllah! Redirecting to WhatsApp to send payment proof... 🌟');
                donationModal.style.display = 'none';
                form.reset();
            };
        }

        // Image slider auto-advance with slowed interval (6 seconds)
        const images = widget.querySelectorAll('.event-image-slider img');
        if (images.length > 0) {
            images[0].classList.add('active');
        }
        if (images.length > 1) {
            let currentImg = 0;
            setInterval(() => {
                images[currentImg].classList.remove('active');
                currentImg = (currentImg + 1) % images.length;
                images[currentImg].classList.add('active');
            }, 6000);
        }
    }

    window.openDonationForm = function (cause) {
        const modal = document.getElementById('eventDonationModal');
        const causeSpan = document.getElementById('selected-cause');
        if (modal && causeSpan) {
            causeSpan.textContent = cause;
            modal.style.display = 'flex';
        }
    };

    // Load Hero Advertisement from LocalStorage (Admin Managed)
    const loadHeroAd = () => {
        const savedAd = localStorage.getItem('heroAd');
        if (savedAd) {
            try {
                const data = JSON.parse(savedAd);
                const adLink = document.getElementById('hero-ad-link');
                const adIcon = document.getElementById('hero-ad-icon');
                const adTitle = document.getElementById('hero-ad-title');
                const adText = document.getElementById('hero-ad-text');

                if (adLink) {
                    if (data.link && data.link !== '#') {
                        adLink.onclick = () => window.open(data.link, '_blank');
                    }
                }
                if (adIcon && data.icon) {
                    adIcon.className = `fa-solid ${data.icon}`;
                }
                if (adTitle && data.title) {
                    adTitle.textContent = data.title;
                }
                if (adText && data.text) {
                    adText.textContent = data.text;
                }
            } catch (e) {
                console.error("Error loading hero ad:", e);
            }
        }
    };

    loadHeroAd();
});
