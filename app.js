import { testLogin, githubAuth, pushContent } from './modules/github.js';
import { generateId, formatDate, blockTypes } from './modules/utils.js';
import { renderPreview } from './modules/preview.js';
import { enableDragDrop } from './modules/dragdrop.js';

// ===== DOM ELEMENTS =====
const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('dashboard');
const editorScreen = document.getElementById('editor-screen');

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginError = document.getElementById('login-error');

const createNewBtn = document.getElementById('create-new-btn');
const contentListContainer = document.getElementById('content-list');

const editorBack = document.getElementById('editor-back');
const editorCanvas = document.getElementById('editor-canvas');
const previewCanvas = document.getElementById('preview-canvas');

const articleTitleInput = document.getElementById('article-title');
const heroImageInput = document.getElementById('hero-image');
const heroHeadlineInput = document.getElementById('hero-headline');
const articleTagsInput = document.getElementById('article-tags');
const articleRailsInput = document.getElementById('article-rails');
const articlePublishedInput = document.getElementById('article-published');

const addParagraphBtn = document.getElementById('add-paragraph-btn');
const addImageBtn = document.getElementById('add-image-btn');
const addVideoBtn = document.getElementById('add-video-btn');
const addStatBtn = document.getElementById('add-stat-btn');

const publishBtn = document.getElementById('publish-btn');

// ===== DATA =====
let contentObjects = []; // Array of articles
let currentEditing = null;

// ===== LOGIN LOGIC =====
loginBtn.addEventListener('click', async () => {
  const username = document.getElementById('github-username').value.trim();
  const token = document.getElementById('github-token').value.trim();
  loginError.innerText = '';
  if (!username || !token) return loginError.innerText = 'Enter username & token';
  const valid = await testLogin(username, token);
  if (valid) {
    loginScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    renderContentList();
  } else loginError.innerText = 'Login failed';
});

logoutBtn.addEventListener('click', () => {
  githubAuth.username = '';
  githubAuth.token = '';
  dashboard.classList.add('hidden');
  loginScreen.classList.remove('hidden');
});

// ===== DASHBOARD =====
createNewBtn.addEventListener('click', () => openEditor());

function renderContentList() {
  contentListContainer.innerHTML = '';
  if (contentObjects.length === 0) {
    contentListContainer.innerHTML = '<p>No articles yet.</p>';
    return;
  }
  contentObjects.forEach(article => {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';
    div.style.background = 'rgba(255,255,255,0.05)';
    div.style.padding = '10px';
    div.style.borderRadius = '8px';
    div.innerHTML = `<span>${article.title} [${article.id}]</span>
      <div>
        <button class="edit-btn">Edit</button>
        <button class="del-btn">Delete</button>
      </div>`;
    contentListContainer.appendChild(div);

    div.querySelector('.del-btn').addEventListener('click', () => {
      contentObjects = contentObjects.filter(x => x.id !== article.id);
      renderContentList();
    });

    div.querySelector('.edit-btn').addEventListener('click', () => openEditor(article));
  });
}

// ===== EDITOR =====
editorBack.addEventListener('click', () => {
  editorScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');
  currentEditing = null;
  editorCanvas.innerHTML = '';
});

addParagraphBtn.addEventListener('click', () => addBlock('text'));
addImageBtn.addEventListener('click', () => addBlock('image'));
addVideoBtn.addEventListener('click', () => addBlock('video'));
addStatBtn.addEventListener('click', () => addBlock('stat'));

function addBlock(type, content = '') {
  const div = document.createElement('div');
  div.dataset.type = type;
  div.draggable = true;
  div.style.padding = '10px';
  div.style.border = '1px solid #555';
  div.style.borderRadius = '8px';
  div.style.cursor = 'move';

  if (type === 'text') {
    div.contentEditable = true;
    div.innerText = content || 'New paragraph';
  } else if (type === 'image') {
    div.contentEditable = true;
    div.innerText = content || 'assets/image.jpg';
  } else if (type === 'video') {
    div.contentEditable = true;
    div.innerText = content || 'assets/video.mp4';
  } else if (type === 'stat') {
    const stat = content || { today: 0, year: 0, change: '0%' };
    div.contentEditable = true;
    div.innerText = JSON.stringify(stat);
  }

  editorCanvas.appendChild(div);
  renderPreview(editorCanvas, previewCanvas);
}

// Live preview updates
editorCanvas.addEventListener('input', () => renderPreview(editorCanvas, previewCanvas));
enableDragDrop(editorCanvas);

// Open editor for new or existing article
function openEditor(article = null) {
  dashboard.classList.add('hidden');
  editorScreen.classList.remove('hidden');
  editorCanvas.innerHTML = '';
  currentEditing = article;

  if (article) {
    articleTitleInput.value = article.title;
    heroImageInput.value = article.hero?.image || '';
    heroHeadlineInput.value = article.hero?.headline || '';
    articleTagsInput.value = (article.tags || []).join(',');
    articleRailsInput.value = (article.rails || []).join(',');
    articlePublishedInput.value = article.published || formatDate(new Date());
    (article.paragraphs || []).forEach(p => addBlock(p.type, p.content));
  } else {
    articleTitleInput.value = '';
    heroImageInput.value = '';
    heroHeadlineInput.value = '';
    articleTagsInput.value = '';
    articleRailsInput.value = '';
    articlePublishedInput.value = formatDate(new Date());
  }
  renderPreview(editorCanvas, previewCanvas);
}

// ===== PUBLISH =====
publishBtn.addEventListener('click', async () => {
  const id = currentEditing?.id || generateId('article');
  const article = {
    id,
    title: articleTitleInput.value,
    hero: { image: heroImageInput.value, headline: heroHeadlineInput.value },
    paragraphs: Array.from(editorCanvas.children).map(b => ({ type: b.dataset.type, content: b.innerText })),
    tags: articleTagsInput.value.split(',').map(s => s.trim()).filter(Boolean),
    rails: articleRailsInput.value.split(',').map(s => s.trim()).filter(Boolean),
    published: articlePublishedInput.value,
    updated: formatDate(new Date())
  };

  if (currentEditing) {
    contentObjects = contentObjects.map(x => x.id === id ? article : x);
  } else {
    contentObjects.push(article);
  }

  renderContentList();
  editorScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');

  // Deploy to GitHub
  try {
    await pushContent('tom-main-site', `data/content/${id}.json`, article);
    alert('Article Published & Deployed!');
  } catch (err) {
    alert('Failed to deploy: ' + err.message);
  }
});