async function login() {
  const user = ghUser.value.trim();
  const token = ghToken.value.trim();
  const repo = ghRepo.value.trim();
  const status = document.getElementById("authStatus");

  if (!user || !token || !repo) {
    status.innerText = "All fields required";
    return;
  }

  status.innerText = "Verifying access...";

  try {
    const res = await fetch(
      `https://api.github.com/repos/${user}/${repo}`,
      {
        headers: {
          Authorization: `token ${token}`
        }
      }
    );

    if (!res.ok) throw new Error("Access denied");

    sessionStorage.setItem("ghUser", user);
    sessionStorage.setItem("ghToken", token);
    sessionStorage.setItem("ghRepo", repo);

    window.location.href = "dashboard.html";

  } catch (err) {
    status.innerText = "Invalid credentials or repo access";
  }
}