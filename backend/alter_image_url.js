const sequelize = require('./src/config/db');

async function alterImageUrlColumn() {
  try {
    await sequelize.query(
      "ALTER TABLE products MODIFY COLUMN image_url TEXT;"
    );
    console.log("✅ Berhasil! Kolom image_url diubah dari VARCHAR(255) ke TEXT.");
    console.log("   Sekarang setiap produk bisa menyimpan banyak URL gambar.");
  } catch (error) {
    if (error.original && error.original.code === 'ER_DUP_FIELDNAME') {
      console.log("ℹ️  Kolom sudah dalam tipe TEXT.");
    } else {
      console.error("❌ Gagal mengubah kolom:", error.message);
    }
  } finally {
    process.exit();
  }
}

alterImageUrlColumn();
