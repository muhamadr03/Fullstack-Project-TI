require('dotenv').config();
const sequelize = require('./src/config/db');
const Banner = require('./src/models/Banner');
async function run() {
  try {
    await Banner.sync({ force: false });
    console.log('Banners table created/synced successfully.');
  } catch (e) { console.error(e); } finally { process.exit(); }
}
run();
