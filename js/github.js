function utf8_to_b64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
  return decodeURIComponent(escape(atob(str)));
}

async function publish() {
  const user = sessionStorage.getItem("ghUser");
  const token = sessionStorage.getItem("ghToken");
  const repo = sessionStorage.getItem("ghRepo");

  // Generate article ID safely
  article.id = article.headline
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  const path = "data/articles.json";

  try {
    // Get existing articles
    const res = await fetch(
      `https://api.github.com/repos/${user}/${repo}/contents/${path}`,
      { headers: { Authorization: `token ${token}` } }
    );

    if (!res.ok) throw new Error("Failed to fetch existing articles");

    const json = await res.json();
    const existing = JSON.parse(b64_to_utf8(json.content));

    // Prepend new article
    existing.unshift(article);

    // Commit
    const putRes = await fetch(
      `https://api.github.com/repos/${user}/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: `Add article: ${article.headline}`,
          content: utf8_to_b64(JSON.stringify(existing, null, 2)),
          sha: json.sha
        })
      }
    );

    if (!putRes.ok) throw new Error("Failed to commit article");

    alert("Published successfully");

  } catch (err) {
    console.error(err);
    alert("Publish failed: " + err.message);
  }
}