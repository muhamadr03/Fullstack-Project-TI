const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    total_amount: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "paid",
        "shipped",
        "completed",
        "cancelled",
      ),
      defaultValue: "pending",
    },
    midtrans_transaction_id: { type: DataTypes.STRING },
    shipping_address: { type: DataTypes.TEXT, allowNull: false },
    tracking_number: { type: DataTypes.STRING },
  },
  {
    tableName: "orders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

module.exports = Order;
