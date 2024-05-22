const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

dotenv.config();

const app = express();

app.use(cors({
    origin: ["https://ultrablog.vercel.app", "https://ultrablog-rhmunna143s-projects.vercel.app"],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Authorization,Content-Type'
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Welcome to the API of blog posts!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});