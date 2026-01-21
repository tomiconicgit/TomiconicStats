import { testLogin, githubAuth, pushContent } from './modules/github.js';

let contentObjects = []; // all articles

// --- LOGIN ---
const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('dashboard');
const editorScreen = document.getElementById('editor-screen');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginError = document.getElementById('login-error');

loginBtn.addEventListener('click', async ()=>{
  const username = document.getElementById('github-username').value;
  const token = document.getElementById('github-token').value;
  if(await testLogin(username, token)){
    loginScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    renderContentList();
  } else loginError.innerText='Login failed';
});

logoutBtn.addEventListener('click', ()=>{
  githubAuth.username=''; githubAuth.token='';
  dashboard.classList.add('hidden');
  loginScreen.classList.remove('hidden');
});

// --- DASHBOARD ---
const createNewBtn = document.getElementById('create-new-btn');
createNewBtn.addEventListener('click', ()=>openEditor());

function renderContentList(){
  const container = document.getElementById('content-list');
  container.innerHTML='';
  contentObjects.forEach(c=>{
    const div=document.createElement('div');
    div.innerHTML=`${c.title} [${c.id}] <button class="edit-btn">Edit</button> <button class="del-btn">Delete</button>`;
    container.appendChild(div);
    div.querySelector('.del-btn').addEventListener('click', ()=>{
      contentObjects = contentObjects.filter(x=>x.id!==c.id);
      renderContentList();
    });
    div.querySelector('.edit-btn').addEventListener('click', ()=>openEditor(c));
  });
}

// --- EDITOR ---
const editorBack = document.getElementById('editor-back');
const editorCanvas = document.getElementById('editor-canvas');
const previewCanvas = document.getElementById('preview-canvas');

editorBack.addEventListener('click', ()=>{
  editorScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');
  renderContentList();
});

// Buttons to add blocks
document.getElementById('add-paragraph-btn').addEventListener('click', ()=>addBlock('text'));
document.getElementById('add-image-btn').addEventListener('click', ()=>addBlock('image'));
document.getElementById('add-video-btn').addEventListener('click', ()=>addBlock('video'));
document.getElementById('add-stat-btn').addEventListener('click', ()=>addBlock('stat'));

function addBlock(type, content=''){
  const div=document.createElement('div');
  div.dataset.type=type;
  div.contentEditable = type==='text';
  div.innerText=type==='text'?content:type.toUpperCase();
  editorCanvas.appendChild(div);
  updatePreview();
}

// Editor live preview
editorCanvas.addEventListener('input', updatePreview);
function updatePreview(){
  previewCanvas.innerHTML='';
  Array.from(editorCanvas.children).forEach(block=>{
    const b=document.createElement('div');
    if(block.dataset.type==='text') b.innerText=block.innerText;
    else if(block.dataset.type==='image') b.innerHTML=`<img src="${block.innerText}" style="max-width:100%">`;
    else if(block.dataset.type==='video') b.innerHTML=`<video src="${block.innerText}" controls style="max-width:100%"></video>`;
    else if(block.dataset.type==='stat') b.innerHTML=`<div style="border:1px solid #fff;padding:8px">STAT BLOCK: ${block.innerText}</div>`;
    previewCanvas.appendChild(b);
  });
}

// Open editor for new or existing content
function openEditor(article=null){
  dashboard.classList.add('hidden');
  editorScreen.classList.remove('hidden');
  editorCanvas.innerHTML='';
  if(article){
    document.getElementById('article-title').value=article.title;
    document.getElementById('hero-image').value=article.hero?.image||'';
    document.getElementById('hero-headline').value=article.hero?.headline||'';
    document.getElementById('article-tags').value=(article.tags||[]).join(',');
    document.getElementById('article-rails').value=(article.rails||[]).join(',');
    document.getElementById('article-published').value=article.published||'';
    (article.paragraphs||[]).forEach(p=>addBlock(p.type, p.content||''));
  } else {
    document.getElementById('article-title').value='';
    document.getElementById('hero-image').value='';
    document.getElementById('hero-headline').value='';
    document.getElementById('article-tags').value='';
    document.getElementById('article-rails').value='';
    document.getElementById('article-published').value=new Date().toISOString().split('T')[0];
  }
  updatePreview();
}

// --- PUBLISH ---
document.getElementById('publish-btn').addEventListener('click', async ()=>{
  const id='article-'+Date.now();
  const article={
    id,
    title: document.getElementById('article-title').value,
    hero: { image: document.getElementById('hero-image').value, headline: document.getElementById('hero-headline').value },
    paragraphs:Array.from(editorCanvas.children).map(b=>({ type:b.dataset.type, content:b.innerText })),
    tags: document.getElementById('article-tags').value.split(',').map(s=>s.trim()),
    rails: document.getElementById('article-rails').value.split(',').map(s=>s.trim()),
    published: document.getElementById('article-published').value
  };
  contentObjects.push(article);
  renderContentList();
  dashboard.classList.remove('hidden');
  editorScreen.classList.add('hidden');
  // push to GitHub
  await pushContent('tom-main-site', `data/content/${id}.json`, article);
  alert('Article Published & Deployed!');
});