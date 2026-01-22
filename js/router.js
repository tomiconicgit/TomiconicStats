const app = document.getElementById("app");

function route(page) {
  if (page === "editor") renderEditor();
  else renderDashboard();
}

document.querySelectorAll("[data-route]").forEach(btn => {
  btn.onclick = () => route(btn.dataset.route);
});

route("home");