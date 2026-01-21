export let githubAuth = { username: '', token: '' };

// Validate login via GitHub API
export async function testLogin(username, token) {
  githubAuth.username = username;
  githubAuth.token = token;
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: { Authorization: `token ${token}` }
    });
    return res.ok;
  } catch (e) { return false; }
}

// Push content JSON to main site repo
export async function pushContent(repo, path, content) {
  const apiUrl = `https://api.github.com/repos/${githubAuth.username}/${repo}/contents/${path}`;
  const message = `Deploy ${path}`;
  const body = {
    message,
    content: btoa(JSON.stringify(content, null, 2)),
  };
  
  // Check if file exists to update
  let sha;
  try {
    const res = await fetch(apiUrl, {
      headers: { Authorization: `token ${githubAuth.token}` }
    });
    if(res.ok){
      const data = await res.json();
      sha = data.sha;
      body.sha = sha;
    }
  } catch(e){}

  await fetch(apiUrl, {
    method: 'PUT',
    headers: { Authorization: `token ${githubAuth.token}` },
    body: JSON.stringify(body)
  });
}