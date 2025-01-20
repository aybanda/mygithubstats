document.getElementById("fetchStats").addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const statsDiv = document.getElementById("stats");
  statsDiv.innerHTML = "Loading..."; // Add loading indicator

  try {
    console.log("Trying Vercel endpoint...");
    // First try the Vercel dev path
    let response = await fetch(`/api/stats?username=${username}`);
    console.log("Vercel response status:", response.status);

    if (!response.ok) {
      console.log("Trying npm start endpoint...");
      // If that fails, try the npm start path
      response = await fetch(`/stats?username=${username}`);
      console.log("npm start response status:", response.status);
    }

    if (response.ok) {
      const stats = await response.json();
      displayStats(stats);
    } else {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      statsDiv.innerHTML = errorData.message || "User not found";
    }
  } catch (error) {
    console.error("Fetch error:", error);
    statsDiv.innerHTML = "Error fetching user data";
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
