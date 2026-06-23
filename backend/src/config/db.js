const { Sequelize } = require("sequelize");
require("dotenv").config();

// Inisialisasi Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  },
);

// Tes Koneksi
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Berhasil terhubung ke database MySQL via Sequelize ORM.");

    const [columns] = await sequelize.query(
      "SHOW COLUMNS FROM products LIKE 'sold_count';",
    );
    if (!columns || columns.length === 0) {
      console.log(
        "Menambahkan kolom sold_count yang hilang pada tabel products...",
      );
      await sequelize.query(
        "ALTER TABLE products ADD COLUMN sold_count INT(11) NOT NULL DEFAULT 0 AFTER total_reviews;",
      );
      console.log("Kolom sold_count berhasil ditambahkan ke tabel products.");
    }
  } catch (error) {
    console.error("Gagal terhubung ke database:", error);
  }
};

connectDB();

module.exports = sequelize;
