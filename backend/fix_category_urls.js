// fix_category_urls.js — Fix Cloudinary URLs in the categories table
require('dotenv').config();
const { Sequelize } = require('sequelize');

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dsauphhgf';

const s = new Sequelize(
  process.env.DB_NAME || 'ecommerce_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  { host: process.env.DB_HOST || 'localhost', dialect: 'mysql', logging: false }
);

async function fixCategoryUrls() {
  try {
    const [rows] = await s.query('SELECT id, image_url FROM categories');
    console.log(`Found ${rows.length} category(ies) in DB:`);

    for (const row of rows) {
      if (!row.image_url) {
        console.log(`  ID ${row.id}: No image, skipping.`);
        continue;
      }
      console.log(`  ID ${row.id}: "${row.image_url}"`);

      // Already a full Cloudinary URL
      if (row.image_url.startsWith('http')) {
        console.log(`    → Already OK, skipping.`);
        continue;
      }

      // Strip leading /uploads/ to get the Cloudinary public_id path
      const publicId = row.image_url.replace(/^\/uploads\//, '');
      const newUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${publicId}`;

      await s.query(`UPDATE categories SET image_url = ? WHERE id = ?`, {
        replacements: [newUrl, row.id]
      });
      console.log(`    → Fixed: "${newUrl}"`);
    }

    console.log('\nDone! All category URLs fixed.');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await s.close();
  }
}

fixCategoryUrls();
