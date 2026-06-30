require('dotenv').config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log("Berhasil terhubung ke database.");

    // Tabel Cart
    await sequelize.query(`
      ALTER TABLE cart 
      ADD COLUMN selected_image_url VARCHAR(255) NULL AFTER quantity,
      ADD COLUMN selected_size VARCHAR(50) NULL AFTER selected_image_url;
    `);
    console.log("✅ Kolom selected_image_url dan selected_size berhasil ditambahkan ke tabel 'cart'.");

    // Tabel Order Items
    await sequelize.query(`
      ALTER TABLE order_items 
      ADD COLUMN selected_image_url VARCHAR(255) NULL AFTER price_at_purchase,
      ADD COLUMN selected_size VARCHAR(50) NULL AFTER selected_image_url;
    `);
    console.log("✅ Kolom selected_image_url dan selected_size berhasil ditambahkan ke tabel 'order_items'.");

  } catch (error) {
    if (error.original && error.original.code === 'ER_DUP_FIELDNAME') {
      console.log("⚠️ Kolom sudah ada di tabel.");
    } else {
      console.error("❌ Gagal menambahkan kolom:", error);
    }
  } finally {
    await sequelize.close();
  }
}

migrate();
