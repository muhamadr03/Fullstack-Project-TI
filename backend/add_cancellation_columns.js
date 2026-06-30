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
    const migrations = [
      {
        check: "SHOW COLUMNS FROM orders LIKE 'cancellation_status';",
        run: "ALTER TABLE orders ADD COLUMN cancellation_status ENUM('requested','approved','rejected') NULL DEFAULT NULL AFTER discount_amount;",
        name: 'cancellation_status',
      },
      {
        check: "SHOW COLUMNS FROM orders LIKE 'cancellation_reason';",
        run: "ALTER TABLE orders ADD COLUMN cancellation_reason TEXT NULL AFTER cancellation_status;",
        name: 'cancellation_reason',
      },
      {
        check: "SHOW COLUMNS FROM orders LIKE 'cancellation_note';",
        run: "ALTER TABLE orders ADD COLUMN cancellation_note TEXT NULL AFTER cancellation_reason;",
        name: 'cancellation_note',
      },
    ];

    for (const m of migrations) {
      const [rows] = await s.query(m.check);
      if (rows.length === 0) {
        await s.query(m.run);
        console.log(`✅ Kolom '${m.name}' berhasil ditambahkan!`);
      } else {
        console.log(`ℹ️  Kolom '${m.name}' sudah ada.`);
      }
    }
    console.log('\n✅ Migrasi selesai!');
  } catch (e) {
    console.error('❌ Error:', e.message);
  } finally {
    await s.close();
  }
}

migrate();
