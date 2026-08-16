const mysql = require("mysql2/promise");
require("dotenv").config();

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Bağlantını test edirik
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL bağlantısı uğurludur.");
    connection.release();
  } catch (err) {
    console.error("MySQL bağlantı xətası:", err.message);
  }
})(); 

module.exports = pool;
