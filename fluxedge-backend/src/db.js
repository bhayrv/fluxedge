const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL || 
    `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
});
module.exports = pool;