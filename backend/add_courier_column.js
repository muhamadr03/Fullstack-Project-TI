require('dotenv').config();
const { Sequelize } = require('sequelize');

const s = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  { host: process.env.DB_HOST, dialect: 'mysql', logging: false }
);

async function migrate() {
  try {
    const [rows] = await s.query("SHOW COLUMNS FROM orders LIKE 'courier';");
    if (rows.length === 0) {
      await s.query("ALTER TABLE orders ADD COLUMN courier VARCHAR(100) NULL AFTER tracking_number;");
      console.log('✅ Kolom courier berhasil ditambahkan ke tabel orders!');
    } else {
      console.log('ℹ️  Kolom courier sudah ada, tidak perlu migrasi.');
    }
  } catch (e) {
    console.error('❌ Error:', e.message);
  } finally {
    await s.close();
  }
}

migrate();
