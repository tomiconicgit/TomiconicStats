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
    <button onclick="addParagraph()">+ Paragraph</button>

    <div id="blocks"></div>

    <button onclick="publish()">Publish</button>
  `;
}

function addParagraph() {
  const id = Date.now();
  article.blocks.push({ type: "paragraph", content: "" });

  document.getElementById("blocks").innerHTML += `
    <textarea placeholder="Paragraph..."
      oninput="article.blocks[${article.blocks.length - 1}].content=this.value">
    </textarea>
  `;
}