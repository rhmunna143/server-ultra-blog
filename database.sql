CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



ALTER TABLE users
ADD COLUMN full_name VARCHAR(255),
ADD COLUMN image_link TEXT,
ADD COLUMN email VARCHAR(255);

ALTER TABLE posts
ADD COLUMN image_link TEXT;