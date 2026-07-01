const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Cart = sequelize.define(
  "Cart",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    variant_id: { type: DataTypes.INTEGER, allowNull: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    selected_image_url: { type: DataTypes.STRING, allowNull: true },
    selected_size: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "cart",
    timestamps: false,
  },
);

module.exports = Cart;