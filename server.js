const express = require("express");
const cors = require("cors");
const path = require("path");
const statsHandler = require("./api/stats");

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static files from client directory
app.use("/client", express.static(path.join(__dirname, "client")));

// Serve static files from root
app.use(express.static(path.join(__dirname)));

// API routes
app.get("/api/stats", (req, res) => {
  return statsHandler(req, res);
});

// Serve index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Handle 404s
app.use((req, res) => {
  console.log("404 for:", req.url);
  res.status(404).send("Not found");
});

// Only start the server if not running in Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export the app for Vercel
module.exports = app;
