const sequelize = require("../config/db");

// 1. Import Semua Model
const User = require("./User");
const Address = require("./Address");
const Category = require("./Category");
const Product = require("./Product");
const Cart = require("./Cart");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Review = require("./Review");

// Relasi User - Address (One-to-Many)
User.hasMany(Address, { foreignKey: "user_id", as: "addresses" });
Address.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Relasi Category - Product (One-to-Many)
Category.hasMany(Product, { foreignKey: "category_id", as: "products" });
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });

// Relasi User - Cart (One-to-Many)
User.hasMany(Cart, { foreignKey: "user_id", as: "cart_items" });
Cart.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Relasi Product - Cart (One-to-Many)
Product.hasMany(Cart, { foreignKey: "product_id", as: "carts" });
Cart.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Relasi User - Order (One-to-Many)
User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
Order.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Relasi Order - OrderItem (One-to-Many)
Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// Relasi Product - OrderItem (One-to-Many)
Product.hasMany(OrderItem, { foreignKey: "product_id", as: "order_items" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Relasi User - Review (One-to-Many)
User.hasMany(Review, { foreignKey: "user_id", as: "reviews" });
Review.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Relasi Product - Review (One-to-Many)
Product.hasMany(Review, { foreignKey: "product_id", as: "reviews" });
Review.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Relasi Order - Review (One-to-Many)
Order.hasMany(Review, { foreignKey: "order_id", as: "reviews" });
Review.belongsTo(Order, { foreignKey: "order_id", as: "order" });

module.exports = {
  sequelize,
  User,
  Address,
  Category,
  Product,
  Cart,
  Order,
  OrderItem,
  Review,
};
