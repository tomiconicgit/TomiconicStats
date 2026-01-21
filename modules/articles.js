export let articles = [
  {
    id: "starmer-2026",
    title: "Keir Starmer on Borders",
    summary: "Latest UK government statement",
    labels: ["STATEMENT"],
    image: "assets/starmer.jpg",
    rail: "statements"
  }
];

export function addArticle(article) { articles.push(article); }
export function updateArticle(id, newData) {
  const index = articles.findIndex(a => a.id === id);
  if (index !== -1) articles[index] = { ...articles[index], ...newData };
}
export function deleteArticle(id) {
  const index = articles.findIndex(a => a.id === id);
  if (index !== -1) articles.splice(index, 1);
}