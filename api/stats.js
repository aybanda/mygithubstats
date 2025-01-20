const axios = require("axios");

export default async function handler(req, res) {
  const { username } = req.query;

  // Validate username
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    // Configure axios with GitHub API headers
    const config = {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // Add auth token if you have one
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`
      },
    };

    // Make parallel requests for better performance
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

    return res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching data from GitHub API:", error);

    // Handle different types of errors
    if (error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({ message: "User not found" });
      }
      if (error.response.status === 403) {
        return res.status(429).json({ message: "Rate limit exceeded" });
      }
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}
