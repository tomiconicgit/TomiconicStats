export let githubAuth = { username: '', token: '' };

export async function testLogin(username, token) {
  const res = await fetch('https://api.github.com/user', {
    headers: { Authorization: `token ${token}` }
  });
  if (res.ok) { githubAuth.username = username; githubAuth.token = token; return true; }
  else return false;
}

export async function pushContent(repo, path, content, branch='main') {
  const url = `https://api.github.com/repos/${githubAuth.username}/${repo}/contents/${path}`;
  
  let sha;
  const getRes = await fetch(url, { headers: { Authorization: `token ${githubAuth.token}` } });
  if (getRes.ok) { sha = (await getRes.json()).sha; }

  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `token ${githubAuth.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Admin Studio Content Update',
      content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
      branch,
      sha
    })
  });
  return res.ok;
}