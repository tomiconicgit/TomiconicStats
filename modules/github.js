export let githubAuth = {
  username: '',
  token: ''
};

export async function testLogin(username, token) {
  const res = await fetch('https://api.github.com/user', {
    headers: { Authorization: `token ${token}` }
  });
  if (res.ok) {
    githubAuth.username = username;
    githubAuth.token = token;
    return true;
  } else {
    return false;
  }
}

export async function pushFileToRepo(path, content, repo, branch='main', message='Update via admin') {
  const url = `https://api.github.com/repos/${githubAuth.username}/${repo}/contents/${path}`;
  
  // Get SHA if file exists
  const getRes = await fetch(url, {
    headers: { Authorization: `token ${githubAuth.token}` }
  });
  let sha;
  if (getRes.ok) {
    const data = await getRes.json();
    sha = data.sha;
  }

  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `token ${githubAuth.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
      branch,
      sha
    })
  });
  return res.ok;
}