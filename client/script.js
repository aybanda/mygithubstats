document.getElementById("fetchStats").addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const response = await fetch(`/api/stats?username=${username}`);

  if (response.ok) {
    const stats = await response.json();
    displayStats(stats);
  } else {
    document.getElementById("stats").innerHTML = "User not found";
  }
});

function displayStats(stats) {
  const statsDiv = document.getElementById("stats");
  statsDiv.innerHTML = `
           <img src="${stats.avatar_url}" alt="${stats.name}'s avatar" width="100">
           <h2>${stats.name}</h2>
           <p>Public Repos: ${stats.public_repos}</p>
           <p>Followers: ${stats.followers}</p>
           <p>Following: ${stats.following}</p>
           <h3>Repositories:</h3>
           <ul>
               ${stats.repos.map((repo) => `<li><a href="${repo.url}" target="_blank">${repo.name} - ⭐ ${repo.stars}</a></li>`).join("")}
           </ul>
       `;
}
