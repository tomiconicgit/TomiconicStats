// app.js
import { statsData, articlesData } from './data/stats.js';

// --- DOM Elements ---
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

// --- Component Generators ---

function createStatCard(stat, isHero = false) {
    const card = document.createElement('div');
    card.className = 'card';
    if(isHero) card.style.minWidth = '280px';

    // HTML Structure for the card
    card.innerHTML = `
        <div class="stat-header">
            <span class="label" style="color: ${stat.category === 'silence' ? 'var(--danger)' : 'var(--accent)'}">${stat.category}</span>
            <ion-icon name="share-outline" class="share-btn"></ion-icon>
        </div>
        <div class="display-value">${stat.value}</div>
        <div class="stat-unit">${stat.unit}</div>
        <p class="context">${stat.context}</p>
        <small class="source-tag">Source: ${stat.source}</small>
    `;

    // Click event to enter "Signage Mode"
    card.querySelector('.share-btn').addEventListener('click', (e) => {
        e.stopPropagation(); // Don't trigger card click
        enterScreenshotMode(stat);
    });

    return card;
}

function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'card';
    
    // Find linked stat
    const linkedStat = statsData.find(s => s.id === article.linkedStatId);
    
    card.innerHTML = `
        <span class="label">Analysis</span>
        <h3 style="margin: 10px 0; font-size: 1.2rem;">${article.headline}</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 15px;">${article.summary}</p>
        
        <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; display: flex; align-items: center; gap: 10px;">
            <div style="font-weight: 700; font-size: 1.2rem;">${linkedStat.value}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">${linkedStat.title}</div>
        </div>
    `;
    return card;
}

// --- Rendering Logic ---

function renderApp() {
    // 1. Render Dashboard Hero (Critical items)
    const criticalStats = statsData.filter(s => s.critical);
    criticalStats.forEach(stat => {
        containers.hero.appendChild(createStatCard(stat, true));
    });

    // 2. Render Dashboard Trending
    const trendingStats = statsData.filter(s => s.trending);
    trendingStats.forEach(stat => {
        containers.trending.appendChild(createStatCard(stat));
    });

    // 3. Render Full Stats Page
    statsData.forEach(stat => {
        containers.fullStats.appendChild(createStatCard(stat));
    });

    // 4. Render Articles
    articlesData.forEach(article => {
        containers.articles.appendChild(createArticleCard(article));
    });
}

// --- View Controller ---

window.switchView = (viewName) => {
    // Hide all
    Object.values(views).forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    // Show target
    views[viewName].classList.add('active');
    
    // Update Nav State (Quick and dirty for demo)
    const navIndex = ['dashboard', 'statistics', 'articles'].indexOf(viewName);
    document.querySelectorAll('.nav-item')[navIndex].classList.add('active');
    
    // Reset scroll
    window.scrollTo(0,0);
};

// --- Signage / Screenshot Logic ---

window.enterScreenshotMode = (stat) => {
    document.body.classList.add('screenshot-mode');
    
    // Inject data into the "Stage"
    document.getElementById('shot-title').innerText = stat.title;
    document.getElementById('shot-value').innerText = stat.value;
    document.getElementById('shot-context').innerText = stat.context;
};

window.exitScreenshotMode = () => {
    document.body.classList.remove('screenshot-mode');
};

// Initialize
document.addEventListener('DOMContentLoaded', renderApp);
