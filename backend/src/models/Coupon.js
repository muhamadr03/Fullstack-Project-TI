const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Coupon = sequelize.define(
  "Coupon",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    discount_percentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    valid_until: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "coupons",
    timestamps: true,
  }
);

module.exports = Coupon;
