const sequelize = require("./src/config/db");

async function alterTable() {
  try {
    await sequelize.query(
      "ALTER TABLE categories ADD COLUMN image_url VARCHAR(255) NULL;",
    );
    console.log("Column image_url added successfully to categories table.");
  } catch (error) {
    if (error.original && error.original.code === "ER_DUP_FIELDNAME") {
      console.log("Column image_url already exists.");
    } else {
      console.error("Error altering table:", error);
    }
  }

  try {
    const [columns] = await sequelize.query(
      "SHOW COLUMNS FROM products LIKE 'sold_count';",
    );
    if (!columns || columns.length === 0) {
      await sequelize.query(
        "ALTER TABLE products ADD COLUMN sold_count INT(11) NOT NULL DEFAULT 0 AFTER total_reviews;",
      );
      console.log("Column sold_count added successfully to products table.");
    } else {
      console.log("Column sold_count already exists in products table.");
    }
  } catch (error) {
    if (error.original && error.original.code === "ER_DUP_FIELDNAME") {
      console.log("Column sold_count already exists.");
    } else {
      console.error("Error checking or altering products table:", error);
    }
  } finally {
    process.exit();
  }
}

alterTable();
