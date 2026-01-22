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

// Simple dictionary for spellcheck demo
const dictionary = ["the","and","to","of","in","for","with","on","this","that","is","are","has","have","be","it","as","at","from"];

function isWordCorrect(word) {
  if (!word) return true;
  return dictionary.includes(word.toLowerCase());
}

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

    <button onclick="publish()">Publish Article</button>
  `;

  // Render existing blocks if any
  article.blocks.forEach((block, idx) => {
    renderParagraphBlock(block, idx);
  });
}

function addParagraph() {
  const block = {
    type: "paragraph",
    content: "",
    highlights: []
  };
  article.blocks.push(block);
  renderParagraphBlock(block, article.blocks.length - 1);
}

function renderParagraphBlock(block, index) {
  const container = document.getElementById("blocks");

  const blockEl = document.createElement("div");
  blockEl.className = "paragraph-block block";
  blockEl.dataset.index = index;

  blockEl.innerHTML = `
    <div class="editor-toolbar">
      <button type="button" class="highlight-toggle">Highlight</button>
      <button type="button" class="done-btn">Done</button>
      <button type="button" class="override-btn">Override Spellcheck</button>
      <span class="spell-warning"></span>
    </div>
    <div class="editor-content" contenteditable="true" spellcheck="true">${block.content}</div>
  `;

  container.appendChild(blockEl);

  const editor = blockEl.querySelector(".editor-content");
  const highlightBtn = blockEl.querySelector(".highlight-toggle");
  const doneBtn = blockEl.querySelector(".done-btn");
  const overrideBtn = blockEl.querySelector(".override-btn");
  const warningEl = blockEl.querySelector(".spell-warning");

  let highlightMode = false;
  let overrideSpell = false;

  highlightBtn.onclick = () => {
    highlightMode = !highlightMode;
    highlightBtn.style.background = highlightMode ? "yellow" : "";
  };

  editor.addEventListener("input", () => {
    // Wrap new words in highlight span if highlightMode
    if (highlightMode) {
      wrapCurrentWord(editor);
    }

    block.content = editor.innerHTML;

    // Spellcheck
    const text = editor.innerText;
    const words = text.split(/\s+/);
    const misspelled = words.filter(word => !isWordCorrect(word));
    if (misspelled.length && !overrideSpell) {
      warningEl.innerText = `Misspelled: ${misspelled.join(", ")}`;
      doneBtn.disabled = true;
    } else {
      warningEl.innerText = "";
      doneBtn.disabled = false;
    }
  });

  overrideBtn.onclick = () => {
    overrideSpell = true;
    warningEl.innerText = "Spellcheck overridden.";
    doneBtn.disabled = false;
  };

  doneBtn.onclick = () => {
    block.content = editor.innerHTML;
    alert("Paragraph saved!");
  };
}

// Helper: Wrap the current word in highlight span
function wrapCurrentWord(editor) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const wordRange = range.cloneRange();
  wordRange.expand("word");
  const wordText = wordRange.toString();

  if (!wordText.trim()) return;

  const span = document.createElement("span");
  span.className = "highlight";
  span.textContent = wordText;

  wordRange.deleteContents();
  wordRange.insertNode(span);

  // Move caret to end
  range.setStartAfter(span);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}