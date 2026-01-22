let article = {
  id: "",
  headline: "",
  subheadline: "",
  category: "",
  heroLabel: "",
  publishDate: "",
  showOnHero: false,
  blocks: []
};

/* =========================
   RENDER EDITOR
========================= */
function renderEditor() {
  app.innerHTML = `
    <h1>New Article</h1>

    <input placeholder="Headline" oninput="article.headline=this.value">
    <input placeholder="Subheadline" oninput="article.subheadline=this.value">

    <select onchange="article.category=this.value">
      <option>World</option>
      <option>Britain</option>
      <option>America</option>
      <option>Immigration</option>
    </select>

    <select onchange="article.heroLabel=this.value">
      <option value="">None</option>
      <option>New</option>
      <option>Breaking</option>
      <option>Latest</option>
    </select>

    <label>
      <input type="checkbox" onchange="article.showOnHero=this.checked">
      Push to main hero
    </label>

    <h2>Content</h2>
    <button onclick="addParagraph()">+ Paragraph</button>

    <div id="blocks"></div>

    <button onclick="publish()">Publish</button>
  `;
}

/* =========================
   ADD PARAGRAPH BLOCK
========================= */
function addParagraph() {
  const blockIndex = article.blocks.length;
  article.blocks.push({ type: "paragraph", content: "" });

  const blockContainer = document.createElement("div");
  blockContainer.className = "block paragraph-block";

  blockContainer.innerHTML = `
    <div class="toolbar">
      <button onclick="formatText('bold')"><b>B</b></button>
      <button onclick="formatText('italic')"><i>I</i></button>
      <button onclick="formatText('underline')"><u>U</u></button>
      <button onclick="formatText('strikeThrough')">S</button>
      <button onclick="formatText('insertOrderedList')">OL</button>
      <button onclick="formatText('insertUnorderedList')">UL</button>
      <button onclick="formatText('formatBlock', 'BLOCKQUOTE')">❝</button>
      <input type="color" onchange="formatText('foreColor', this.value)" title="Text color">
      <input type="color" onchange="formatText('hiliteColor', this.value)" title="Highlight color">
      <button onclick="undo()">↺</button>
      <button onclick="redo()">↻</button>
      <button onclick="insertLink()">🔗</button>
    </div>

    <div contenteditable="true" class="editable" spellcheck="true"></div>
    <div class="block-actions">
      <button onclick="finishBlock(${blockIndex}, this)">Done</button>
      <button class="edit-btn hidden" onclick="editBlock(${blockIndex}, this)">Edit</button>
      <span class="spell-error hidden">Spelling errors detected</span>
      <button class="override-btn hidden" onclick="overrideSpell(${blockIndex}, this)">Override</button>
    </div>
  `;

  document.getElementById("blocks").appendChild(blockContainer);
  blockContainer.querySelector(".editable").focus();
}

/* =========================
   FORMAT TEXT
========================= */
function formatText(command, value = null) {
  document.execCommand(command, false, value);
}

/* =========================
   UNDO / REDO
========================= */
function undo() {
  document.execCommand("undo");
}

function redo() {
  document.execCommand("redo");
}

/* =========================
   INSERT LINK
========================= */
function insertLink() {
  const url = prompt("Enter URL:");
  if (url) document.execCommand("createLink", false, url);
}

/* =========================
   SPELLCHECK
========================= */
function dictionaryCheck(word) {
  return /^[a-zA-Z0-9’'-]+$/.test(word); 
}

function validateSpelling(index) {
  const editable = document.querySelectorAll(".editable")[index];
  const errorSpan = editable.parentElement.querySelector(".spell-error");
  const overrideBtn = editable.parentElement.querySelector(".override-btn");

  const words = editable.innerText.split(/\s+/);
  const wrongWords = words.filter(w => !dictionaryCheck(w));

  if (wrongWords.length > 0) {
    errorSpan.classList.remove("hidden");
    overrideBtn.classList.remove("hidden");
    return false;
  } else {
    errorSpan.classList.add("hidden");
    overrideBtn.classList.add("hidden");
    return true;
  }
}

function overrideSpell(index, btn) {
  const errorSpan = btn.parentElement.querySelector(".spell-error");
  errorSpan.classList.add("hidden");
  btn.classList.add("hidden");
}

/* =========================
   FINISH / EDIT BLOCK
========================= */
function finishBlock(index, btn) {
  if (!validateSpelling(index)) {
    alert("Fix spelling errors or override to continue.");
    return;
  }

  btn.classList.add("hidden");
  const editBtn = btn.parentElement.querySelector(".edit-btn");
  editBtn.classList.remove("hidden");

  const editable = document.querySelectorAll(".editable")[index];
  editable.contentEditable = "false";

  // save HTML
  article.blocks[index].content = editable.innerHTML;
}

function editBlock(index, btn) {
  btn.classList.add("hidden");
  const doneBtn = btn.parentElement.querySelector("button:not(.edit-btn)");
  doneBtn.classList.remove("hidden");

  const editable = document.querySelectorAll(".editable")[index];
  editable.contentEditable = "true";
  editable.focus();
}

/* =========================
   PUBLISH ARTICLE TO GITHUB
========================= */
async function publish() {
  const user = sessionStorage.getItem("ghUser");
  const token = sessionStorage.getItem("ghToken");
  const repo = sessionStorage.getItem("ghRepo");

  article.id = article.headline
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  const path = "data/articles.json";

  const res = await fetch(
    `https://api.github.com/repos/${user}/${repo}/contents/${path}`,
    { headers: { Authorization: `token ${token}` } }
  );

  const json = await res.json();
  const existing = JSON.parse(atob(json.content));

  existing.unshift(article);

  await fetch(
    `https://api.github.com/repos/${user}/${repo}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `Add article: ${article.headline}`,
        content: btoa(JSON.stringify(existing, null, 2)),
        sha: json.sha
      })
    }
  );

  alert("Published successfully");
}

/* =========================
   INIT
========================= */
renderEditor();