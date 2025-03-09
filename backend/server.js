const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// API Routes
app.use("/api/users", userRoutes);

// Serve frontend index.html for all unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/index.html"));  // FIXED PATH
});

// Show login modal
function showLogin() {
    document.getElementById("loginModal").style.display = "flex";
}

// Close login modal
function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}


// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
