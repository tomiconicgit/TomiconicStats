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
    <div class="block-actions">
      <button onclick="addParagraph()">+ Paragraph</button>
      <button onclick="generateParagraphAI()">🎯 Generate AI Paragraph</button>
    </div>

    <div id="blocks"></div>

    <div class="publish-bar">
      <button onclick="publish()">Publish</button>
    </div>
  `;
}

/* =========================
   PARAGRAPH BLOCK
========================= */
function addParagraph(content = "") {
  const id = Date.now();
  const blockIndex = article.blocks.length;
  article.blocks.push({ type: "paragraph", content: content });

  const blocks = document.getElementById("blocks");
  const blockDiv = document.createElement("div");
  blockDiv.className = "block paragraph-block";
  blockDiv.dataset.index = blockIndex;

  blockDiv.innerHTML = `
    <div contenteditable="true" class="editable">${content}</div>
    <div class="block-tools">
      <button class="highlight-toggle">Highlight</button>
      <button class="done-btn">Done</button>
      <button class="edit-btn hidden">Edit</button>
      <span class="spell-error hidden">⚠ Spelling issues!</span>
      <button class="override-btn hidden">Override</button>
    </div>
  `;

  blocks.appendChild(blockDiv);

  const editable = blockDiv.querySelector(".editable");
  const highlightBtn = blockDiv.querySelector(".highlight-toggle");
  const doneBtn = blockDiv.querySelector(".done-btn");
  const editBtn = blockDiv.querySelector(".edit-btn");
  const spellError = blockDiv.querySelector(".spell-error");
  const overrideBtn = blockDiv.querySelector(".override-btn");

  let highlightMode = false;
  let overrideSpell = false;

  /* =========================
     HIGHLIGHT TOGGLE
  ========================= */
  highlightBtn.addEventListener("click", () => {
    highlightMode = !highlightMode;
    highlightBtn.style.background = highlightMode ? "#fff3" : "transparent";
  });

  editable.addEventListener("input", () => {
    const sel = window.getSelection();
    if (highlightMode && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const span = document.createElement("span");
      span.style.backgroundColor = "yellow";
      range.surroundContents(span);
      sel.removeAllRanges();
    }
    // Update live content
    article.blocks[blockIndex].content = editable.innerHTML;
    runSpellcheck(editable, spellError);
  });

  /* =========================
     DONE / EDIT
  ========================= */
  doneBtn.addEventListener("click", () => {
    if (spellError.classList.contains("visible") && !overrideSpell) {
      alert("Please fix spelling issues or override.");
      return;
    }
    editable.contentEditable = "false";
    doneBtn.classList.add("hidden");
    editBtn.classList.remove("hidden");
  });

  editBtn.addEventListener("click", () => {
    editable.contentEditable = "true";
    editBtn.classList.add("hidden");
    doneBtn.classList.remove("hidden");
  });

  overrideBtn.addEventListener("click", () => {
    overrideSpell = true;
    spellError.classList.add("hidden");
  });
}

/* =========================
   AI GENERATED PARAGRAPH
========================= */
async function generateParagraphAI() {
  const prompt = promptInput("Enter prompt for AI paragraph:");

  if (!prompt) return;

  const loader = addTemporaryLoader();
  try {
    const generated = await callAI(prompt); // Placeholder function
    addParagraph(generated);
  } catch (err) {
    alert("AI generation failed: " + err.message);
  } finally {
    removeTemporaryLoader(loader);
  }
}

/* =========================
   SPELLCHECK FUNCTION
========================= */
function runSpellcheck(editable, spellError) {
  const text = editable.innerText;
  const words = text.split(/\s+/);
  let errors = false;

  words.forEach(word => {
    if (!spellCorrect(word)) {
      errors = true;
    }
  });

  if (errors) {
    spellError.classList.remove("hidden");
    spellError.classList.add("visible");
  } else {
    spellError.classList.remove("visible");
    spellError.classList.add("hidden");
  }
}

// VERY basic spellcheck demo; replace with real dictionary
function spellCorrect(word) {
  const ignore = ["AI", "UK", "US"]; // exceptions
  if (ignore.includes(word)) return true;
  return /^[a-zA-Z0-9.,'’\-]+$/.test(word);
}

/* =========================
   TEMP LOADER
========================= */
function addTemporaryLoader() {
  const loader = document.createElement("div");
  loader.innerText = "Generating...";
  loader.style.padding = "12px";
  loader.style.color = "#fff";
  document.getElementById("blocks").appendChild(loader);
  return loader;
}

function removeTemporaryLoader(loader) {
  loader.remove();
}

/* =========================
   FAKE AI CALL (replace with real API)
========================= */
async function callAI(prompt) {
  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("AI generated paragraph based on prompt: " + prompt);
    }, 1500);
  });
}

/* =========================
   PUBLISH
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