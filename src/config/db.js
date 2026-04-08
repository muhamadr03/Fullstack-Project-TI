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
  } catch (error) {
    console.error("Gagal terhubung ke database:", error);
  }
};

connectDB();

module.exports = sequelize;
