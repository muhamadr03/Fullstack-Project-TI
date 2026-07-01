const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProductVariant = sequelize.define(
  "ProductVariant",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    sku: { type: DataTypes.STRING(100), allowNull: true },
    price: { type: DataTypes.INTEGER, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: "product_variants",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = ProductVariant;
