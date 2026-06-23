// fix_banner_urls.js — Fix Cloudinary URLs di database banners
require('dotenv').config();
const { Sequelize } = require('sequelize');

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dsauphhgf';

const s = new Sequelize(
  process.env.DB_NAME || 'ecommerce_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  { host: process.env.DB_HOST || 'localhost', dialect: 'mysql', logging: false }
);

async function fixBannerUrls() {
  try {
    const [rows] = await s.query('SELECT id, image_url FROM banners');
    console.log(`Found ${rows.length} banner(s) in DB:`);

    for (const row of rows) {
      console.log(`  ID ${row.id}: "${row.image_url}"`);
      if (!row.image_url) continue;

      // Already a full Cloudinary URL
      if (row.image_url.startsWith('http')) {
        console.log(`    → Already OK, skipping.`);
        continue;
      }

      // Strip leading /uploads/ to get the Cloudinary public_id path
      const publicId = row.image_url.replace(/^\/uploads\//, '');
      const newUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${publicId}`;

      await s.query(`UPDATE banners SET image_url = ? WHERE id = ?`, {
        replacements: [newUrl, row.id]
      });
      console.log(`    → Fixed: "${newUrl}"`);
    }

    console.log('\nDone! All banner URLs fixed.');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await s.close();
  }
}

fixBannerUrls();
