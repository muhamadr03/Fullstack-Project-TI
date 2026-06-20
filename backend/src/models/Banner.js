const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Banner = sequelize.define('Banner', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  image_url: { type: DataTypes.STRING, allowNull: false },
  link_url: { type: DataTypes.STRING, allowNull: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'banners', timestamps: true, createdAt: 'created_at', updatedAt: false });
module.exports = Banner;
