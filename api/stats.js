const axios = require("axios");

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const config = {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    };

    console.log(`Fetching data for username: ${username}`); // Debug log

    const [userResponse, reposResponse] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, config),
      axios.get(`https://api.github.com/users/${username}/repos`, config),
    ]);

    const stats = {
      avatar_url: userResponse.data.avatar_url,
      name: userResponse.data.name,
      public_repos: userResponse.data.public_repos,
      followers: userResponse.data.followers,
      following: userResponse.data.following,
      repos: reposResponse.data.map((repo) => ({
        name: repo.name,
        stars: repo.stargazers_count,
        url: repo.html_url,
        language: repo.language,
        description: repo.description,
      })),
    };

    console.log("Successfully fetched stats"); // Debug log
    return res.status(200).json(stats);
  } catch (error) {
    console.error("Error details:", error.message); // Debug log

    if (error.response) {
      console.error("GitHub API response status:", error.response.status); // Debug log

      if (error.response.status === 404) {
        return res.status(404).json({ message: "User not found" });
      }
      if (error.response.status === 403) {
        return res.status(429).json({ message: "Rate limit exceeded" });
      }
    }

    return res
      .status(500)
      .json({ message: "Error fetching data from GitHub API" });
  }
};
