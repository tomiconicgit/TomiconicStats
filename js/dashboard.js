function renderDashboard() {
  app.innerHTML = `
    <h1>Dashboard</h1>

    <div class="stats-grid">
      <div class="stat">Articles<br><strong>—</strong></div>
      <div class="stat">Views<br><strong>—</strong></div>
      <div class="stat">Clicks<br><strong>—</strong></div>
    </div>

    <p>Phase 1: Article publishing enabled</p>
  `;
}