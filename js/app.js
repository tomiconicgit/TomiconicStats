import { articles, stats } from './data.js';

const app = document.getElementById('app');

// --- Views ---

const HomeView = () => {
    const heroArticle = articles.find(a => a.isHero) || articles[0];
    const otherArticles = articles.filter(a => !a.isHero);

    let statsHTML = stats.map(s => `
        <div class="stat-card" onclick="alert('Detailed Stats View for: ${s.label}')">
            <div class="stat-label">${s.label}</div>
            <div class="stat-val" style="color: ${s.color}">${s.value}</div>
            <div class="stat-trend">${s.trend}</div>
        </div>
    `).join('');

    let articlesHTML = otherArticles.map(a => `
        <div class="article-card" onclick="window.loadArticle(${a.id})">
            <img src="${a.image}" class="article-thumb" loading="lazy" />
            <div class="badge new">New</div>
            <div class="article-head">${a.title}</div>
        </div>
    `).join('');

    return `
        <div class="hero" style="background-image: url('${heroArticle.image}');" onclick="window.loadArticle(${heroArticle.id})">
            <div class="hero-content">
                <span class="badge new">Breaking</span>
                <h1 class="hero-title">${heroArticle.title}</h1>
                <p>${heroArticle.category} • ${heroArticle.date}</p>
            </div>
        </div>

        <h3 class="section-title">Key Metrics</h3>
        <div class="scroll-container hide-scroll">
            ${statsHTML}
        </div>

        <h3 class="section-title">Latest Articles</h3>
        <div class="scroll-container hide-scroll">
            ${articlesHTML}
        </div>
        
        <div style="height: 100px;"></div> `;
};

const ArticleView = (article) => {
    window.scrollTo(0,0);
    
    // Generate coded statistics for this specific article
    const statBlocks = Object.entries(article.stats).map(([key, val]) => `
        <div class="article-stat-block">
            <small style="color:#888; text-transform:uppercase;">${key}</small>
            <div style="font-size:24px; font-weight:bold; color:var(--accent);">${val}</div>
        </div>
    `).join('');

    return `
        <button class="back-btn" onclick="router.navigate('home')">← Back</button>
        <div class="article-view">
            <div class="article-hero" style="background-image: url('${article.heroImage}');">
                <div style="position:absolute; bottom:0; padding:20px; background:linear-gradient(transparent, #050505);">
                    <h1 style="font-size:36px; line-height:1.1;">${article.title}</h1>
                </div>
            </div>
            <div class="article-body">
                <p style="font-family: 'Playfair Display', serif; font-size: 22px; margin-bottom: 20px;">
                    ${article.content.substring(0, 50)}...
                </p>
                ${statBlocks}
                <p>${article.content} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                <img src="${article.image}" style="width:100%; border-radius:12px; margin: 20px 0;" />
                <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
        </div>
    `;
};

const ListView = (type) => {
    // Reusing logic for the "Full Library" view
    const data = type === 'articles' ? articles : stats;
    
    return `
        <div style="padding: 100px 20px;">
            <h1>All ${type}</h1>
            <input type="text" placeholder="Search archive..." style="width:100%; padding:15px; background:#222; border:none; color:white; margin:20px 0; border-radius:8px;">
            
            <div style="display:grid; gap:15px;">
                ${data.map(item => `
                    <div style="background:#1a1a1a; padding:20px; border-radius:8px; display:flex; align-items:center; gap:15px;">
                        ${item.image ? `<img src="${item.image}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;">` : ''}
                        <div>
                            <div style="font-weight:bold;">${item.title || item.label}</div>
                            <div style="color:#888; font-size:12px;">${item.category || item.value}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
};

// --- Router Logic ---

window.router = {
    navigate: (route) => {
        // Update URL hash (optional, allows back button to work naturally if expanded)
        // For now, simple content swapping
        
        // Update Nav State
        document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
        
        if (route === 'home') {
            document.querySelector("button[onclick*='home']").classList.add('active');
            app.innerHTML = HomeView();
        } else if (route === 'stats') {
             document.querySelector("button[onclick*='stats']").classList.add('active');
             app.innerHTML = ListView('stats');
        } else if (route === 'articles') {
             document.querySelector("button[onclick*='articles']").classList.add('active');
             app.innerHTML = ListView('articles');
        }
    }
};

// Global function to trigger article load
window.loadArticle = (id) => {
    const article = articles.find(a => a.id === id);
    if(article) {
        app.innerHTML = ArticleView(article);
    }
};

// Initial Load
router.navigate('home');
