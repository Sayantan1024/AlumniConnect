const express = require("express");
const bcrypt = require("bcrypt");
const connection = require("../db"); // Import database connection
const router = express.Router();

// User registration route
router.post("/register", async (req, res) => {
    const { fullName, email, password, userType, graduationYear, department } = req.body;

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (full_name, email, password, user_type, graduation_year, department) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

    connection.query(
        sql,
        [fullName, email, hashedPassword, userType, graduationYear || null, department],
        (err, result) => {
            if (err) {
                console.error("Error inserting user:", err);
                return res.status(500).json({ message: "Registration failed!" });
            }
            res.status(201).json({ message: "Registration successful!" });
        }
    );
});

module.exports = router;
