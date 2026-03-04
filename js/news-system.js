document.addEventListener('DOMContentLoaded', () => {
    const newsHomeGrid = document.getElementById('news-home-grid');
    const newsFullGrid = document.getElementById('news-full-grid');

    // Load News from LocalStorage (Preview) or Data File
    let currentNews = [];
    const savedNews = localStorage.getItem('workbridge_news');

    if (savedNews) {
        currentNews = JSON.parse(savedNews);
    } else if (window.newsData) {
        currentNews = window.newsData;
    }

    if (newsHomeGrid && currentNews.length > 0) {
        // Show latest 3 on homepage
        renderNewsCards(newsHomeGrid, currentNews.slice(0, 3));
    }

    if (newsFullGrid && currentNews.length > 0) {
        // Show all on news page
        renderNewsCards(newsFullGrid, currentNews);
    }

    function renderNewsCards(container, newsItems) {
        container.innerHTML = newsItems.map(item => `
            <article class="news-card reveal">
                <div class="news-image">
                    <img src="${item.image}" alt="${item.title}">
                    <span class="news-category">${item.category}</span>
                </div>
                <div class="news-body">
                    <div class="news-date">${item.date}</div>
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-text">${item.summary}</p>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 1rem;">
                        <a href="${item.link}" class="news-link">Read More <i class="fa-solid fa-arrow-right"></i></a>
                        <button class="btn-share" onclick="shareContent('${item.title.replace(/'/g, "\\'")}', 'Check out this news on WorkBridge!', window.location.origin + '/${item.link}')">
                            <i class="fa-solid fa-share-nodes"></i>
                        </button>
                    </div>
                </div>
            </article>
        `).join('');
    }
});
