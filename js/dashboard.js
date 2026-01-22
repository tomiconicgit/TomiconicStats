function renderDashboard() {
  app.innerHTML = `
    <section class="home-hero">
      <h1>Command Centre</h1>
      <p>Create, publish, and control everything.</p>
    </section>

    <section class="home-actions">

      <div class="action-card primary" onclick="route('editor')">
        <h2>New Article</h2>
        <p>Write and publish a story</p>
      </div>

      <div class="action-card disabled">
        <h2>Analytics</h2>
        <p>Views, engagement, regions</p>
        <span class="badge">Soon</span>
      </div>

      <div class="action-card disabled">
        <h2>Statistics Library</h2>
        <p>Live data, trackers, embeds</p>
        <span class="badge">Next</span>
      </div>

    </section>
  `;
}