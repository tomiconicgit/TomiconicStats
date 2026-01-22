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

    <h2>Content Blocks</h2>
    <div class="block-actions">
      <button onclick="addParagraph()">+ Paragraph</button>
      <button onclick="addHighlight()">+ Highlight</button>
      <button onclick="addImage()">+ Image (Placeholder)</button>
    </div>

    <div id="blocks"></div>

    <div class="publish-bar">
      <button onclick="publish()">Publish</button>
    </div>
  `;

  // Render existing blocks if any
  renderBlocks();
}

function renderBlocks() {
  const container = document.getElementById("blocks");
  container.innerHTML = "";

  article.blocks.forEach((block, index) => {
    let el;
    if (block.type === "paragraph") {
      el = document.createElement("textarea");
      el.placeholder = "Paragraph...";
      el.value = block.content;
      el.oninput = (e) => (article.blocks[index].content = e.target.value);
    }

    if (block.type === "highlight") {
      el = document.createElement("textarea");
      el.placeholder = "Highlight / Callout...";
      el.value = block.content;
      el.className = "highlight-block";
      el.oninput = (e) => (article.blocks[index].content = e.target.value);
    }

    if (block.type === "image") {
      el = document.createElement("div");
      el.className = "image-block";
      el.innerHTML = `
        <input type="text" placeholder="Image URL" value="${block.src || ""}" 
          oninput="article.blocks[${index}].src=this.value">
        <input type="text" placeholder="Caption" value="${block.caption || ""}"
          oninput="article.blocks[${index}].caption=this.value">
      `;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "block";
    wrapper.appendChild(el);
    container.appendChild(wrapper);
  });
}

// Block adders
function addParagraph() {
  article.blocks.push({ type: "paragraph", content: "" });
  renderBlocks();
}

function addHighlight() {
  article.blocks.push({ type: "highlight", content: "" });
  renderBlocks();
}

function addImage() {
  article.blocks.push({ type: "image", src: "", caption: "" });
  renderBlocks();
}