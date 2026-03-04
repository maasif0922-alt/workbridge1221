const defaultNewsData = [
    {
        "id": "news-1",
        "title": "WorkBridge reaches 50,000 Verified Workers!",
        "date": "February 27, 2026",
        "category": "Platform",
        "summary": "We are proud to announce a major milestone in our journey to connect talent with opportunity...",
        "image": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=400",
        "link": "news-detail.html"
    },
    {
        "id": "news-2",
        "title": "How to make your Profile stand out to Employers",
        "date": "February 25, 2026",
        "category": "Career Advice",
        "summary": "Learn the top 5 tips from our successful freelancers on how to attract high-paying clients...",
        "image": "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=400",
        "link": "news-detail.html"
    },
    {
        "id": "news-3",
        "title": "Demand for Remote Data Entry up by 40%",
        "date": "February 22, 2026",
        "category": "Market Trends",
        "summary": "Recent market analysis shows a significant surge in demand for remote administrative roles...",
        "image": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400",
        "link": "news-detail.html"
    }
];

// Exporting for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = defaultNewsData;
} else {
    window.newsData = defaultNewsData;
}
