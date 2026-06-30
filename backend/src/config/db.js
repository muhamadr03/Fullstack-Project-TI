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

    const [tables] = await sequelize.query("SHOW TABLES LIKE 'wishlists';");
    if (!tables || tables.length === 0) {
      console.log("Membuat tabel wishlists yang hilang...");
      await sequelize.query(`
        CREATE TABLE wishlists (
          id INT(11) NOT NULL AUTO_INCREMENT,
          user_id INT(11) NOT NULL,
          product_id INT(11) NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          KEY user_id (user_id),
          KEY product_id (product_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
      console.log("Tabel wishlists berhasil dibuat.");
    }

    const [orderColumns] = await sequelize.query(
      "SHOW COLUMNS FROM orders LIKE 'courier';",
    );
    if (!orderColumns || orderColumns.length === 0) {
      console.log("Menambahkan kolom courier yang hilang pada tabel orders...");
      await sequelize.query(
        "ALTER TABLE orders ADD COLUMN courier VARCHAR(100) NULL AFTER tracking_number;",
      );
      console.log("Kolom courier berhasil ditambahkan ke tabel orders.");
    }
  } catch (error) {
    console.error("Gagal terhubung ke database:", error);
  }
};

connectDB();

module.exports = sequelize;
