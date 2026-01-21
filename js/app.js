import { articles, globalStats } from './data.js';

const app = document.getElementById('app');

// --- Helper: Number Animation ---
const animateValue = (obj, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        let val = (progress * (end - start) + start);
        obj.innerHTML = Number.isInteger(end) ? Math.floor(val).toLocaleString() : val.toFixed(1);
        if (progress < 1) window.requestAnimationFrame(step);
        else obj.innerHTML = Number.isInteger(end) ? end.toLocaleString() : end.toFixed(1);
    };
    window.requestAnimationFrame(step);
};

// --- Views ---
const HomeView = () => {
    const hero = articles.find(a => a.isHero) || articles[0];
    const heroTags = hero.tags || ["Breaking"];
    const heroDate = hero.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Stats Cards
    const statsHTML = globalStats.map((s, index) => `
        <div class="stat-card-home" id="card-${index}" onclick="window.loadStatDetail('${s.id}')">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span style="font-size:12px; color:#888; text-transform:uppercase; letter-spacing:1px;">
                    <span class="live-dot"></span> Live Tracking
                </span>
                <span style="font-size:16px;">↓</span>
            </div>
            <div class="stat-val-wrapper" style="font-size:42px; font-weight:800; color:${s.color};">
                ${s.prefix || ''}<span class="live-num" data-val="${s.value}">${s.value}</span>${s.suffix || ''}
            </div>
            <div style="font-size:14px; color:#ccc; margin-top:5px;">${s.label}</div>
        </div>
    `).join('');

    const dotsHTML = globalStats.map((_, i) => `<div class="dot ${i===0?'active':''}" id="dot-${i}"></div>`).join('');

    // Article Cards
    const articlesHTML = articles.filter(a => !a.isHero).map(a => `
        <div class="article-preview-card" onclick="window.loadArticle(${a.id})">
            <img src="${a.image}" class="article-preview-img" />
            <div class="article-preview-content">
                <h3 class="article-preview-headline">${a.title}</h3>
                <div class="article-preview-meta">
                    <span class="article-preview-label">${a.category}</span>
                    <span style="font-size:10px; color:#aaa;">${a.date || 'Today'}</span>
                </div>
            </div>
        </div>
    `).join('');

    return `
        <div class="hero animate-entry" style="background-image: url('${hero.image}'); background-size:cover;">
            <div class="hero-overlay">
                <div class="hero-tags">
                    ${heroTags.map(tag => `<span class="hero-tag">${tag}</span>`).join('')}
                </div>
                <h1 class="hero-headline">${hero.title}</h1>
                <div class="hero-meta">
                    <span><div class="live-dot-hero"></div> Live</span>
                    <span>${hero.category || 'General'}</span>
                    <span>${heroDate}</span>
                </div>
            </div>
        </div>

        <div style="position:relative; top:-40px; z-index:10;" class="animate-entry delay-1">
            <div class="stat-wrapper">
                <div class="stat-slider hide-scroll" id="statSlider">
                    ${statsHTML}
                </div>
                <div class="dots-container">${dotsHTML}</div>
            </div>
        </div>

        <h3 style="padding:0 20px; margin-bottom:15px; font-weight:600; color:var(--text-secondary);" class="animate-entry delay-2">Latest Reports</h3>
        <div class="article-slider hide-scroll animate-entry delay-2">
            ${articlesHTML}
        </div>
        <div style="height:100px;"></div>
    `;
};

// --- Stat Detail View (unchanged) ---
const StatDetailView = (id) => { /* previous code here */ };

// --- Logic Hook ---
const initHomeLogic = () => {
    const slider = document.getElementById('statSlider');
    const dots = document.querySelectorAll('.dot');
    
    if (slider) {
        slider.addEventListener('scroll', () => {
            const cardWidth = slider.querySelector('.stat-card-home').offsetWidth + 15;
            const index = Math.round(slider.scrollLeft / cardWidth);
            dots.forEach(d => d.classList.remove('active'));
            if(dots[index]) dots[index].classList.add('active');
        });
    }

    document.querySelectorAll('.live-num').forEach(el => {
        const target = parseFloat(el.getAttribute('data-val'));
        animateValue(el, 0, target, 1500);
    });

    if(window.liveInterval) clearInterval(window.liveInterval);
    window.liveInterval = setInterval(() => {
        document.querySelectorAll('.live-num').forEach(el => {
            if(Math.random() > 0.7) { 
                const original = parseFloat(el.getAttribute('data-val'));
                const variance = original * 0.01;
                const newVal = (original + (Math.random() * variance * 2 - variance));
                el.innerText = Number.isInteger(original) ? Math.floor(newVal).toLocaleString() : newVal.toFixed(1);
            }
        });
    }, 2000);
};

// --- Router ---
window.router = {
    navigate: (route) => {
        if (route === 'home') {
            app.innerHTML = HomeView();
            initHomeLogic();
        } 
        // other routes...
    }
};

window.loadStatDetail = (id) => { app.innerHTML = StatDetailView(id); };

// Start
router.navigate('home');