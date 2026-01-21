import { testLogin, githubAuth, pushFileToRepo } from './modules/github.js';
import { stats, addStat, updateStat, deleteStat } from './modules/stats.js';
import { articles, addArticle, updateArticle, deleteArticle } from './modules/articles.js';

const loginScreen = document.getElementById('login-screen');
const adminPanel = document.getElementById('admin-panel');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginError = document.getElementById('login-error');

loginBtn.addEventListener('click', async () => {
  const username = document.getElementById('github-username').value;
  const token = document.getElementById('github-token').value;
  const success = await testLogin(username, token);
  if (success) {
    loginScreen.classList.add('hidden');
    adminPanel.classList.remove('hidden');
    renderStats();
    renderArticles();
  } else {
    loginError.innerText = 'Login failed, check username or token';
  }
});

logoutBtn.addEventListener('click', () => {
  githubAuth.username = '';
  githubAuth.token = '';
  adminPanel.classList.add('hidden');
  loginScreen.classList.remove('hidden');
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// STATS UI
function renderStats() {
  const container = document.getElementById('stats-list');
  container.innerHTML = '';
  stats.forEach(stat => {
    const div = document.createElement('div');
    div.innerHTML = `
      <strong>${stat.label}</strong> - ${stat.value} ${stat.unit} 
      <button data-id="${stat.id}" class="edit-btn">Edit</button>
      <button data-id="${stat.id}" class="delete-btn">Delete</button>
    `;
    container.appendChild(div);
  });

  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteStat(btn.dataset.id);
      renderStats();
    });
  });

  container.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newValue = prompt('New value:');
      updateStat(btn.dataset.id, { value: newValue });
      renderStats();
    });
  });
}

// ARTICLES UI
function renderArticles() {
  const container = document.getElementById('articles-list');
  container.innerHTML = '';
  articles.forEach(article => {
    const div = document.createElement('div');
    div.innerHTML = `
      <strong>${article.title}</strong> - ${article.labels.join(', ')}
      <button data-id="${article.id}" class="edit-btn">Edit</button>
      <button data-id="${article.id}" class="delete-btn">Delete</button>
    `;
    container.appendChild(div);
  });

  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteArticle(btn.dataset.id);
      renderArticles();
    });
  });

  container.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newTitle = prompt('New title:');
      updateArticle(btn.dataset.id, { title: newTitle });
      renderArticles();
    });
  });
}

// PUBLISH BUTTON (example)
document.addEventListener('keydown', async e => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    // push stats to main repo
    const successStats = await pushFileToRepo('data/stats.json', stats, 'tom-main-site');
    const successArticles = await pushFileToRepo('data/articles.json', articles, 'tom-main-site');
    if (successStats && successArticles) alert('Published to main repo!');
    else alert('Publish failed');
  }
});