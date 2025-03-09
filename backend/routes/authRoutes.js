const express = require("express");
const bcrypt = require("bcrypt");
const connection = require("../db"); // Import database connection
const router = express.Router();

// User Login Route
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists
    connection.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            console.error("Error during login:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = results[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Login successful
        res.json({ message: "Login successful", redirect: "dashboard.html" });
    });
});

module.exports = router;
