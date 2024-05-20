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
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
            [username, hashedPassword]
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

        res.json({ token, username: user.rows[0].username, user_id: user.rows[0].id });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update username route
router.put('/update-username/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;
    const { newUsername } = req.body;

    try {
        // Check if the user exists
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

        if (user.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        // Check if new username is provided
        if (!newUsername) {
            return res.status(400).send('New username is required');
        }

        // Update the username
        await pool.query(
            "UPDATE users SET username = $1 WHERE id = $2",
            [newUsername, userId]
        );

        // Fetch updated user data
        const updatedUser = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

        res.json(updatedUser.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;