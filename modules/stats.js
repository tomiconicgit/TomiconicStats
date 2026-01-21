export let stats = [
  {
    id: "uk-silence",
    label: "UK Government Silence",
    value: 214,
    unit: "days",
    context: "Days since last official statement",
    updated: "2026-01-20",
    trending: true
  }
];

// Helper to add/edit/delete stats
export function addStat(stat) { stats.push(stat); }
export function updateStat(id, newData) {
  const index = stats.findIndex(s => s.id === id);
  if (index !== -1) stats[index] = { ...stats[index], ...newData };
}
export function deleteStat(id) {
  const index = stats.findIndex(s => s.id === id);
  if (index !== -1) stats.splice(index, 1);
}