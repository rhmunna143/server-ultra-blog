const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();
// Create a new post
router.post('/', authenticateToken, async (req, res) => {
    const { title, content, image_link } = req.body;

    try {
        const newPost = await pool.query(
            "INSERT INTO posts (user_id, title, content, image_link) VALUES ($1, $2, $3, $4) RETURNING *",
            [req.user.id, title, content, image_link || null]
        );
        res.json(newPost.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await pool.query("SELECT * FROM posts");
        res.json(posts.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get all posts by the current user
router.get('/users-post', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const userPosts = await pool.query("SELECT * FROM posts WHERE user_id = $1", [userId]);
        res.json(userPosts.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get a single post
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const post = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);

        if (post.rows.length === 0) {
            return res.status(404).send('Post not found');
        }

        res.json(post.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update a post
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, content, image_link } = req.body;

    try {
        const post = await pool.query("SELECT * FROM posts WHERE id = $1 AND user_id = $2", [id, req.user.id]);

        if (post.rows.length === 0) {
            return res.status(404).send('Post not found or you are not the author');
        }

        const updatedPost = await pool.query(
            "UPDATE posts SET title = $1, content = $2, image_link = $3 WHERE id = $4 RETURNING *",
            [title, content, image_link || post.rows[0].image_link, id]
        );

        res.json(updatedPost.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete a post
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const post = await pool.query("SELECT * FROM posts WHERE id = $1 AND user_id = $2", [id, req.user.id]);

        if (post.rows.length === 0) {
            return res.status(404).send('Post not found or you are not the author');
        }

        await pool.query("DELETE FROM posts WHERE id = $1", [id]);

        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;