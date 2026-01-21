import { articles, globalStats } from './data.js';

const app = document.getElementById('app');

// --- Helper: Number Animation ---
const animateValue = (obj, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Handle decimals
        let val = (progress * (end - start) + start);
        obj.innerHTML = Number.isInteger(end) ? Math.floor(val).toLocaleString() : val.toFixed(1);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
             obj.innerHTML = Number.isInteger(end) ? end.toLocaleString() : end.toFixed(1);
        }
    };
    window.requestAnimationFrame(step);
};

// --- Views ---

const HomeView = () => {
    // Hero logic...
    const hero = articles.find(a => a.isHero) || articles[0];
    
    // Generate Stats Cards (HTML)
    const statsHTML = globalStats.map((s, index) => `
        <div class="stat-card-home" id="card-${index}" onclick="window.loadStatDetail('${s.id}')">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span style="font-size:12px; color:#888; text-transform:uppercase; letter-spacing:1px;">
                    <span class="live-dot"></span> Live Tracking
                </span>
                <span style="font-size:16px;">↗</span>
            </div>
            <div class="stat-val-wrapper" style="font-size:42px; font-weight:800; color:${s.color};">
                ${s.prefix || ''}<span class="live-num" data-val="${s.value}">${s.value}</span>${s.suffix || ''}
            </div>
            <div style="font-size:14px; color:#ccc; margin-top:5px;">${s.label}</div>
        </div>
    `).join('');

    // Generate Dots (HTML)
    const dotsHTML = globalStats.map((_, i) => `<div class="dot ${i===0?'active':''}" id="dot-${i}"></div>`).join('');

    // Generate 16:9 Article Sliders (HTML)
    const articlesHTML = articles.filter(a => !a.isHero).map(a => `
        <div class="article-slider-item" onclick="window.loadArticle(${a.id})">
            <div class="article-slider-tag">${a.category}</div>
            <img src="${a.image}" class="article-slider-bg" />
            <div class="article-slider-overlay">
                <h3 style="font-size:18px; line-height:1.2; font-weight:600; text-shadow:0 2px 10px rgba(0,0,0,0.5);">${a.title}</h3>
            </div>
        </div>
    `).join('');

    return `
        <div class="hero animate-entry" style="background-image: url('${hero.image}'); height:70vh; background-size:cover; display:flex; align-items:flex-end;">
            <div class="hero-content" style="background:linear-gradient(to top, #000, transparent); width:100%; padding:30px 20px 80px;">
                <span style="background:var(--accent-red); color:white; padding:4px 8px; font-weight:800; font-size:10px; text-transform:uppercase;">Breaking</span>
                <h1 style="font-size:40px; margin-top:10px; line-height:1.05;">${hero.title}</h1>
            </div>
        </div>

        <div style="position:relative; top:-40px; z-index:10;" class="animate-entry delay-1">
            <div class="stat-wrapper">
                <div class="stat-slider hide-scroll" id="statSlider">
                    ${statsHTML}
                </div>
                <div class="dots-container">
                    ${dotsHTML}
                </div>
            </div>
        </div>

        <h3 style="padding:0 20px; margin-bottom:15px; font-weight:600; color:var(--text-secondary);" class="animate-entry delay-2">Latest Reports</h3>
        <div class="stat-slider hide-scroll animate-entry delay-2">
            ${articlesHTML}
        </div>
        <div style="height:100px;"></div>
    `;
};

const StatDetailView = (id) => {
    const stat = globalStats.find(s => s.id === id);
    window.scrollTo(0,0);

    // Mock "Coded" Visualization (CSS bars)
    const bars = stat.history.map(h => {
        const height = (h / Math.max(...stat.history)) * 100;
        return `<div style="width:40px; height:${height}%; background:${stat.color}; opacity:0.8; border-radius:4px 4px 0 0;"></div>`;
    }).join('');

    return `
        <div style="padding:100px 20px 40px; min-height:100vh; background:linear-gradient(to bottom, #111, #000);">
             <button onclick="router.navigate('home')" style="color:white; background:none; border:none; font-size:16px; margin-bottom:20px;">← Back to Dashboard</button>
             
             <div class="animate-entry">
                <span class="live-dot"></span> <span style="color:#888; text-transform:uppercase; letter-spacing:2px; font-size:12px;">Live Source</span>
                <h1 style="font-size:48px; margin:10px 0; line-height:1;">${stat.label}</h1>
                <h2 style="font-size:64px; color:${stat.color}; font-weight:800;">
                    ${stat.prefix || ''}${stat.value}${stat.suffix || ''}
                </h2>
                <p style="color:#aaa; max-width:600px; margin-top:10px; line-height:1.6;">${stat.description} This data is aggregated from real-time global trackers and verified by our internal algorithms.</p>
             </div>

             <div class="animate-entry delay-1" style="margin-top:60px; height:300px; border-bottom:1px solid #333; display:flex; align-items:flex-end; justify-content:space-between; padding-bottom:10px;">
                ${bars}
             </div>
             <div style="display:flex; justify-content:space-between; margin-top:10px; color:#555; font-size:12px;">
                <span>Q1</span><span>Q2</span><span>Q3</span><span>Now</span>
             </div>
        </div>
    `;
};

// --- Logic Hook ---
const initHomeLogic = () => {
    // 1. Scroll Observer for Dots
    const slider = document.getElementById('statSlider');
    const dots = document.querySelectorAll('.dot');
    
    if (slider) {
        slider.addEventListener('scroll', () => {
            const cardWidth = slider.querySelector('.stat-card-home').offsetWidth + 15; // width + gap
            const index = Math.round(slider.scrollLeft / cardWidth);
            
            dots.forEach(d => d.classList.remove('active'));
            if(dots[index]) dots[index].classList.add('active');
        });
    }

    // 2. Count Up Animation
    document.querySelectorAll('.live-num').forEach(el => {
        const target = parseFloat(el.getAttribute('data-val'));
        animateValue(el, 0, target, 1500);
    });

    // 3. "Alive" Simulation (Randomly twitch numbers)
    // Clear previous interval if exists to avoid stacking
    if(window.liveInterval) clearInterval(window.liveInterval);
    
    window.liveInterval = setInterval(() => {
        document.querySelectorAll('.live-num').forEach(el => {
            // Only update 30% of the time to not be annoying
            if(Math.random() > 0.7) { 
                const original = parseFloat(el.getAttribute('data-val'));
                const variance = original * 0.01; // 1% variance
                const newVal = (original + (Math.random() * variance * 2 - variance));
                el.innerText = Number.isInteger(original) ? Math.floor(newVal).toLocaleString() : newVal.toFixed(1);
            }
        });
    }, 2000);
};

// --- Router ---
window.router = {
    navigate: (route) => {
        // ... (Nav button logic)
        
        if (route === 'home') {
            app.innerHTML = HomeView();
            initHomeLogic(); // Run logic after HTML injection
        } 
        // ... (other routes)
    }
};

window.loadStatDetail = (id) => {
    app.innerHTML = StatDetailView(id);
};

// Start
router.navigate('home');
