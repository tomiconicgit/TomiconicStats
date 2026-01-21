import { testLogin, githubAuth, pushContent } from './modules/github.js';
import { contentObjects, addContent, updateContent, deleteContent } from './modules/content.js';

const loginScreen = document.getElementById('login-screen');
const adminPanel = document.getElementById('admin-panel');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginError = document.getElementById('login-error');

loginBtn.addEventListener('click', async () => {
  const username = document.getElementById('github-username').value;
  const token = document.getElementById('github-token').value;
  if(await testLogin(username, token)) {
    loginScreen.classList.add('hidden');
    adminPanel.classList.remove('hidden');
    renderContentList();
    renderPreview();
  } else loginError.innerText = 'Login failed';
});

logoutBtn.addEventListener('click', () => {
  githubAuth.username = ''; githubAuth.token = '';
  adminPanel.classList.add('hidden');
  loginScreen.classList.remove('hidden');
});

// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// MODAL LOGIC
const modal = document.getElementById('content-modal');
const modalClose = document.getElementById('modal-close');
const addContentBtn = document.getElementById('add-content-btn');
const form = document.getElementById('content-form');

addContentBtn.addEventListener('click', ()=> { modal.classList.remove('hidden'); });
modalClose.addEventListener('click', ()=> modal.classList.add('hidden'));

// Add dynamic stat inputs
const statsContainer = document.getElementById('stats-list-form');
const addStatBtn = document.getElementById('add-stat-btn');
addStatBtn.addEventListener('click', ()=> {
  const div = document.createElement('div');
  div.innerHTML = `<input type="text" placeholder="Label"><input type="text" placeholder="Value"><button type="button" class="del-stat">✕</button>`;
  statsContainer.appendChild(div);
  div.querySelector('.del-stat').addEventListener('click', ()=> div.remove());
});

// Save Content
form.addEventListener('submit', e => {
  e.preventDefault();
  const id = Date.now().toString();
  const type = document.getElementById('content-type').value;
  const title = document.getElementById('content-title').value;
  const summary = document.getElementById('content-summary').value;
  const hero = document.getElementById('content-hero').checked;
  const rails = document.getElementById('content-rails').value.split(',').map(s=>s.trim());
  const labels = document.getElementById('content-labels').value.split(',').map(s=>s.trim());
  const updated = document.getElementById('content-updated').value;
  
  let statsArr = [];
  statsContainer.querySelectorAll('div').forEach(div=>{
    const inputs = div.querySelectorAll('input');
    statsArr.push({ label: inputs[0].value, value: inputs[1].value });
  });

  const image = document.getElementById('content-image').value;
  const video = document.getElementById('content-video').value;

  const obj = { id, type, title, summary, hero, rails, labels, updated, stats: statsArr, image, video };
  addContent(obj);
  renderContentList();
  renderPreview();
  modal.classList.add('hidden');
});

// Render list
function renderContentList() {
  const container = document.getElementById('content-list');
  container.innerHTML = '';
  contentObjects.forEach(c=>{
    const div = document.createElement('div');
    div.innerHTML = `<strong>${c.title}</strong> [${c.type}] 
      <button data-id="${c.id}" class="edit-btn">Edit</button>
      <button data-id="${c.id}" class="del-btn">Delete</button>`;
    container.appendChild(div);

    div.querySelector('.del-btn').addEventListener('click', ()=>{
      deleteContent(c.id);
      renderContentList();
      renderPreview();
    });
  });
}

// Render Preview
function renderPreview() {
  const area = document.getElementById('preview-area');
  area.innerHTML = '';
  contentObjects.forEach(c=>{
    const div = document.createElement('div');
    div.style.border='1px solid #555'; div.style.padding='10px'; div.style.margin='10px 0';
    div.innerHTML = `<strong>${c.title}</strong> (${c.type})<br>${c.summary}<br>
      Labels: ${c.labels.join(', ')}<br>
      Rails: ${c.rails.join(', ')}<br>
      Stats: ${c.stats.map(s=>`${s.label}: ${s.value}`).join(', ')}<br>
      Hero: ${c.hero ? 'Yes':'No'}`;
    area.appendChild(div);
  });
}

// Publish all content to GitHub repo
document.addEventListener('keydown', async e=>{
  if(e.ctrlKey && e.key==='s'){
    e.preventDefault();
    for(const c of contentObjects){
      await pushContent('tom-main-site', `data/content/${c.id}.json`, c);
    }
    alert('Published all content to main repo!');
  }
});