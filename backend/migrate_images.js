const sequelize = require('./src/config/db');
const { Product, ProductImage } = require('./src/models');

async function migrateImages() {
  try {
    console.log("Starting image migration...");
    
    // Sync table product_images
    await sequelize.sync({ alter: true });
    console.log("Database synced.");

    const products = await Product.findAll();
    
    for (const product of products) {
      if (product.image_url) {
        const urls = product.image_url.split(",").map(u => u.trim()).filter(Boolean);
        if (urls.length > 0) {
          const imageRecords = urls.map((url, index) => ({
            product_id: product.id,
            image_url: url,
            is_primary: index === 0, // first image is primary
          }));
          await ProductImage.bulkCreate(imageRecords);
          console.log(`Migrated ${urls.length} images for Product ID ${product.id}`);
        }
      }
    }
    
    // Drop image_url column from products
    const queryInterface = sequelize.getQueryInterface();
    const tableDesc = await queryInterface.describeTable('products');
    if (tableDesc.image_url) {
      await queryInterface.removeColumn('products', 'image_url');
      console.log("Dropped image_url column from products table.");
    }
    
    console.log("Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateImages();
