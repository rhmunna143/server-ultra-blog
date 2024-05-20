const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// const pool = new Pool({
//     connectionString: process.env.POSTGRES_URL,
// });

console.log("Connected to the database");

module.exports = pool;