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