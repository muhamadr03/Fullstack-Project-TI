require('dotenv').config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  }
);

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log("Berhasil terhubung ke database.");

    // 1. Buat Tabel product_variants
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS product_variants (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        sku VARCHAR(100) NULL,
        price INT NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
    console.log("✅ Tabel 'product_variants' berhasil dibuat.");

    // 2. Buat Tabel variant_attributes
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS variant_attributes (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        variant_id INT NOT NULL,
        attribute_name VARCHAR(100) NOT NULL,
        attribute_value VARCHAR(100) NOT NULL,
        FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
    console.log("✅ Tabel 'variant_attributes' berhasil dibuat.");

    // 3. Tambah kolom variant_id di cart
    try {
      await sequelize.query(`
        ALTER TABLE cart 
        ADD COLUMN variant_id INT NULL AFTER product_id,
        ADD CONSTRAINT fk_cart_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL ON UPDATE CASCADE;
      `);
      console.log("✅ Kolom variant_id berhasil ditambahkan ke tabel 'cart'.");
    } catch (error) {
      if (error.original && (error.original.code === 'ER_DUP_FIELDNAME' || error.original.errno === 1060)) {
        console.log("⚠️ Kolom variant_id sudah ada di tabel 'cart'.");
      } else {
        console.log("⚠️ Info tabel cart:", error.message);
      }
    }

    // 4. Tambah kolom variant_id di order_items
    try {
      await sequelize.query(`
        ALTER TABLE order_items 
        ADD COLUMN variant_id INT NULL AFTER product_id,
        ADD CONSTRAINT fk_order_items_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL ON UPDATE CASCADE;
      `);
      console.log("✅ Kolom variant_id berhasil ditambahkan ke tabel 'order_items'.");
    } catch (error) {
      if (error.original && (error.original.code === 'ER_DUP_FIELDNAME' || error.original.errno === 1060)) {
        console.log("⚠️ Kolom variant_id sudah ada di tabel 'order_items'.");
      } else {
        console.log("⚠️ Info tabel order_items:", error.message);
      }
    }

    console.log("🎉 Migrasi Varian Produk Selesai!");
  } catch (error) {
    console.error("❌ Gagal melakukan migrasi:", error);
  } finally {
    await sequelize.close();
  }
}

migrate();
