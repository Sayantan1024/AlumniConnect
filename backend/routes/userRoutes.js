const express = require("express");
const router = express.Router();
const db = require("../config/db");  // Import database connection

// Get all users
router.get("/", (req, res) => {
  db.query("SELECT id, name, email, role FROM users", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// User registration
router.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;
  const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  
  db.query(sql, [name, email, password, role], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "User registered successfully!" });
  });
});

module.exports = router;  // Ensure you're exporting only 'router'
