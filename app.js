// app.js
import { statsData, articlesData } from './data/stats.js';

const views = {
    dashboard: document.getElementById('dashboard'),
    statistics: document.getElementById('statistics'),
    articles: document.getElementById('articles')
};

const containers = {
    hero: document.getElementById('hero-container'),
    trending: document.getElementById('trending-container'),
    fullStats: document.getElementById('full-stats-container'),
    articles: document.getElementById('articles-container')
};

// --- COMPONENTS ---
function createStatCard(stat, isHero = false) {
    const card = document.createElement('div');
    card.className = 'content-card';
    if (isHero) card.style.minWidth = '280px';

    card.innerHTML = `
        <span class="card-tag">${stat.category?.toUpperCase() || 'STAT'}</span>
        <h3>${stat.title || stat.label}</h3>
        <p class="card-value">${stat.value} ${stat.unit || ''}</p>
        <p class="card-sub">${stat.context}</p>
    `;

    card.addEventListener('click', () => {
        openEvent({
            tag: stat.category?.toUpperCase() || 'STAT',
            title: stat.title || stat.label,
            summary: stat.context,
            today: stat.value,
            year: stat.year || 'N/A',
            change: stat.change || '+0%'
        });
    });

    return card;
}

function createArticleCard(article) {
    const linkedStat = statsData.find(s => s.id === article.linkedStatId);
    const card = document.createElement('div');
    card.className = 'content-card';

    card.innerHTML = `
        <span class="card-tag">ANALYSIS</span>
        <h3>${article.headline}</h3>
        <p class="card-sub">${article.summary}</p>
        ${linkedStat ? `<p class="card-value">${linkedStat.value} ${linkedStat.unit}</p>` : ''}
    `;
    return card;
}

// --- RENDER ---
function renderApp() {
    // Hero
    statsData.filter(s => s.critical).forEach(stat => {
        containers.hero.appendChild(createStatCard(stat, true));
    });
    // Trending
    statsData.filter(s => s.trending).forEach(stat => {
        containers.trending.appendChild(createStatCard(stat));
    });
    // Full stats
    statsData.forEach(stat => containers.fullStats.appendChild(createStatCard(stat)));
    // Articles
    articlesData.forEach(article => containers.articles.appendChild(createArticleCard(article)));
}

// --- VIEW SWITCHING ---
window.switchView = (viewName) => {
    Object.values(views).forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    views[viewName].classList.add('active');
    const navIndex = ['dashboard','statistics','articles'].indexOf(viewName);
    document.querySelectorAll('.nav-item')[navIndex].classList.add('active');
    window.scrollTo(0,0);
};

// --- EVENT VIEW ---
const eventView = document.getElementById("eventView");

function openEvent(data) {
    document.getElementById("eventTag").innerText = data.tag;
    document.getElementById("eventTitle").innerText = data.title;
    document.getElementById("eventSummary").innerText = data.summary;

    document.getElementById("statToday").innerText = data.today;
    document.getElementById("statYear").innerText = data.year;
    document.getElementById("statChange").innerText = data.change;

    eventView.classList.remove("hidden");
}

window.closeEvent = () => eventView.classList.add("hidden");

// --- INIT ---
document.addEventListener('DOMContentLoaded', renderApp);