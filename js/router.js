const app = document.getElementById("app");

function route(page) {
  if (page === "editor") {
    renderEditor();
  } else {
    renderDashboard();
  }
}

document.querySelectorAll("[data-route]").forEach(btn => {
  btn.addEventListener("click", () => {
    route(btn.dataset.route);
  });
});

// Default route
route("home");