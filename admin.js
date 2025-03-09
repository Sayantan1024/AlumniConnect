require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "hospital_db",
});

db.connect((err) => {
    if (err) console.error("Database connection failed:", err);
    else console.log("✅ Connected to MySQL database.");
});

// Middleware Setup
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: true,
    })
);

// Root Route (Redirect to Admin Login Page)
app.get("/", (req, res) => {
    res.redirect("/admin");  // Redirect to admin login page
});

// Admin Login Page
app.get("/admin", (req, res) => {
    res.render("admin/admin-login", { message: "" });
});

// Admin Login POST
app.post("/admin", (req, res) => {
    const { email, password } = req.body;

    // For simplicity, check with a hardcoded admin credentials
    if (email === "admin@example.com" && password === "admin@108") {
        req.session.admin = true;
        return res.redirect("/admin/dashboard");
    } else {
        return res.render("admin/admin-login", { message: "❌ Incorrect email or password." });
    }
});

// Admin Logout Route
app.get("/admin/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/admin"));
});

// Admin Dashboard Page
app.get("/admin/dashboard", (req, res) => {
    if (!req.session.admin) return res.redirect("/admin");

    res.render("admin/admin-dashboard");
});

// Add Therapy Page
app.get("/admin/therapy/add", (req, res) => {
    if (!req.session.admin) return res.redirect("/admin");

    res.render("admin/add-therapy", { message: "" });
});

// Handle Add Therapy POST Route
app.post("/admin/therapy/add", async (req, res) => {
    const { therapy_name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO therapy (therapy_name, email, password) VALUES (?, ?, ?)",
        [therapy_name, email, hashedPassword],
        (err) => {
            if (err) return res.render("admin/add-therapy", { message: "❌ Error adding therapy." });
            res.redirect("/admin/therapy/view");
        }
    );
});

// View Therapy Page
app.get("/admin/therapy/view", (req, res) => {
    if (!req.session.admin) return res.redirect("/admin");

    db.query("SELECT * FROM therapy", (err, therapies) => {
        if (err) return res.send("Error loading therapies.");
        res.render("admin/view-therapy", { therapies });
    });
});

// Manage Therapy Page
app.get("/admin/therapy/manage", (req, res) => {
    if (!req.session.admin) return res.redirect("/admin");

    db.query("SELECT * FROM therapy", (err, therapies) => {
        if (err) return res.send("Error loading therapies.");
        res.render("admin/manage-therapy", { therapies });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
