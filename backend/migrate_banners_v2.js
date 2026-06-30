/**
 * migrate_banners_v2.js
 * Run once: node backend/migrate_banners_v2.js
 * Adds new rich-content columns to the banners table.
 */
require('dotenv').config({ path: __dirname + '/.env' });
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

const columns = [
  { name: 'product_image',    def: 'VARCHAR(512) NULL AFTER image_url' },
  { name: 'badge',            def: 'VARCHAR(80)  NULL AFTER product_image' },
  { name: 'heading',          def: 'VARCHAR(160) NULL AFTER badge' },
  { name: 'description',      def: 'TEXT         NULL AFTER heading' },
  { name: 'button_text',      def: "VARCHAR(80)  NULL DEFAULT 'Belanja Sekarang' AFTER description" },
  { name: 'button_link',      def: 'VARCHAR(512) NULL AFTER button_text' },
  { name: 'button2_text',     def: 'VARCHAR(80)  NULL AFTER button_link' },
  { name: 'button2_link',     def: 'VARCHAR(512) NULL AFTER button2_text' },
  { name: 'sale_price',       def: 'VARCHAR(60)  NULL AFTER button2_link' },
  { name: 'original_price',   def: 'VARCHAR(60)  NULL AFTER sale_price' },
  { name: 'text_position',    def: "VARCHAR(10)  NOT NULL DEFAULT 'left' AFTER original_price" },
  { name: 'overlay_opacity',  def: 'FLOAT        NOT NULL DEFAULT 0.35 AFTER text_position' },
  { name: '`order`',          def: 'INT          NOT NULL DEFAULT 0 AFTER overlay_opacity' },
];

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');

    for (const col of columns) {
      const bare = col.name.replace(/`/g, '');
      try {
        await sequelize.query(`ALTER TABLE banners ADD COLUMN ${col.name} ${col.def}`);
        console.log(`  ✅ Added column: ${bare}`);
      } catch (err) {
        if (err.original?.code === 'ER_DUP_FIELDNAME') {
          console.log(`  ⏭️  Column already exists: ${bare}`);
        } else {
          throw err;
        }
      }
    }

    console.log('\n🎉 Migration complete! All columns are ready.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
})();
