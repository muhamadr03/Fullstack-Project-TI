const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const VariantAttribute = sequelize.define(
  "VariantAttribute",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    variant_id: { type: DataTypes.INTEGER, allowNull: false },
    attribute_name: { type: DataTypes.STRING(100), allowNull: false },
    attribute_value: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    tableName: "variant_attributes",
    timestamps: false,
  }
);

module.exports = VariantAttribute;
