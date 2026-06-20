const sequelize = require('./src/config/db');

async function alterTable() {
  try {
    await sequelize.query("ALTER TABLE categories ADD COLUMN image_url VARCHAR(255) NULL;");
    console.log("Column image_url added successfully to categories table.");
  } catch (error) {
    if (error.original && error.original.code === 'ER_DUP_FIELDNAME') {
      console.log("Column image_url already exists.");
    } else {
      console.error("Error altering table:", error);
    }
  } finally {
    process.exit();
  }
}

alterTable();
