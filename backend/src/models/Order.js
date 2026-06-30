const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    total_amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
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
    courier: { type: DataTypes.STRING, allowNull: true },
    snap_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coupon_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    discount_amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // ── Pembatalan Pesanan ──────────────────────────────────────────────────
    cancellation_status: {
      type: DataTypes.ENUM('requested', 'approved', 'rejected'),
      allowNull: true,
      defaultValue: null,
    },
    cancellation_reason: { type: DataTypes.TEXT, allowNull: true },
    cancellation_note:   { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "orders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

module.exports = Order;
