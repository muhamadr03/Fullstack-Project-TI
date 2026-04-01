const mysql = require("mysql2");
require("dotenv").config();

// Membuat pool koneksi
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Menggunakan promise wrapper agar bisa menggunakan async/await
(async () => {
  try {
    const connection = await pool.promise().getConnection();
    console.log("Berhasil terhubung ke database MySQL.");
    connection.release();
  } catch (err) {
    console.error("Gagal terhubung ke database:", err.message);
  }
})();

module.exports = pool.promise();
