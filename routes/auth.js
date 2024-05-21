const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const dotenv = require('dotenv');
const authenticateToken = require('../middleware/auth');

dotenv.config();

const router = express.Router();
// Register route
router.post('/register', async (req, res) => {
    const { username, password, full_name, image_link, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await pool.query(
            "INSERT INTO users (username, password, full_name, image_link, email) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [username, hashedPassword, full_name || null, image_link || null, email || null]
        );
        res.json(newUser.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rows.length === 0) {
            return res.status(400).send('User not found');
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(400).send('Invalid password');
        }

        const token = jwt.sign({ id: user.rows[0].id, username: user.rows[0].username }, process.env.JWT_SECRET);

        // Set the token in a cookie
        res.cookie('token', token, { httpOnly: true });

        res.json({ username: user.rows[0].username, user_id: user.rows[0].id, full_name: user.rows[0].full_name, image_link: user.rows[0].image_link, email: user.rows[0].email });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update user route
router.put('/update-user/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;
    const { newUsername, full_name, image_link, email } = req.body;

    try {
        // Check if the user exists
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

        if (user.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        // If new username is provided, update it
        if (newUsername) {
            await pool.query(
                "UPDATE users SET username = $1 WHERE id = $2",
                [newUsername, userId]
            );
        }

        // Update user details
        await pool.query(
            "UPDATE users SET full_name = $1, image_link = $2, email = $3 WHERE id = $4",
            [
                full_name || user.rows[0].full_name,
                image_link || user.rows[0].image_link,
                email || user.rows[0].email,
                userId
            ]
        );

        // Fetch updated user data
        const updatedUser = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

        res.json(updatedUser.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// Logout route
router.post('/logout', (req, res) => {
    // Clear the token cookie
    res.clearCookie('token');
    res.sendStatus(200);
});

// Check if user is logged in route 
router.get('/check-login', authenticateToken, async (req, res) => {
    try {
        // Fetch user details from the database
        const user = await pool.query("SELECT id, username, full_name, image_link, email FROM users WHERE id = $1", [req.user.id]);

        if (user.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        res.json(user.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;