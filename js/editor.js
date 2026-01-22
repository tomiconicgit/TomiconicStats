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
      <button onclick="addHighlight()">+ Highlight</button>
      <button onclick="addImage()">+ Image</button>
    </div>

    <div id="blocks"></div>

    <div class="publish-bar">
      <button onclick="publish()">Publish</button>
    </div>
  `;
}

/* ---------- ADD BLOCK FUNCTIONS ---------- */
function addParagraph() {
  article.blocks.push({ type: "paragraph", content: "" });
  const idx = article.blocks.length - 1;

  const container = document.getElementById("blocks");
  const textarea = document.createElement("textarea");
  textarea.placeholder = "Paragraph...";
  textarea.oninput = e => article.blocks[idx].content = e.target.value;
  container.appendChild(textarea);
}

function addHighlight() {
  article.blocks.push({ type: "highlight", content: "" });
  const idx = article.blocks.length - 1;

  const container = document.getElementById("blocks");
  const textarea = document.createElement("textarea");
  textarea.placeholder = "Highlight...";
  textarea.oninput = e => article.blocks[idx].content = e.target.value;
  textarea.style.background = "rgba(255,255,255,0.12)";
  textarea.style.borderLeft = "4px solid #fff";
  textarea.style.fontWeight = "500";
  container.appendChild(textarea);
}

function addImage() {
  article.blocks.push({ type: "image", src: "", caption: "" });
  const idx = article.blocks.length - 1;

  const container = document.getElementById("blocks");

  const wrapper = document.createElement("div");
  wrapper.className = "image-block";

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      wrapper.querySelector(".image-preview img").src = ev.target.result;
      article.blocks[idx].src = ev.target.result; // store base64 for now
    };
    reader.readAsDataURL(file);
  };

  const preview = document.createElement("div");
  preview.className = "image-preview";
  preview.innerHTML = `<img src="" alt="Preview">`;

  const caption = document.createElement("input");
  caption.type = "text";
  caption.placeholder = "Caption (optional)";
  caption.oninput = e => article.blocks[idx].caption = e.target.value;

  wrapper.appendChild(fileInput);
  wrapper.appendChild(preview);
  wrapper.appendChild(caption);
  container.appendChild(wrapper);
}