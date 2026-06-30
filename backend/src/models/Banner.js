const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Banner = sequelize.define('Banner', {
  id:               { type: DataTypes.INTEGER,    primaryKey: true, autoIncrement: true },
  title:            { type: DataTypes.STRING,     allowNull: false },
  image_url:        { type: DataTypes.STRING(512),allowNull: false },
  product_image:    { type: DataTypes.STRING(512),allowNull: true },
  badge:            { type: DataTypes.STRING(80), allowNull: true },
  heading:          { type: DataTypes.STRING(160),allowNull: true },
  description:      { type: DataTypes.TEXT,       allowNull: true },
  button_text:      { type: DataTypes.STRING(80), allowNull: true, defaultValue: 'Belanja Sekarang' },
  button_link:      { type: DataTypes.STRING(512),allowNull: true },
  button2_text:     { type: DataTypes.STRING(80), allowNull: true },
  button2_link:     { type: DataTypes.STRING(512),allowNull: true },
  sale_price:       { type: DataTypes.STRING(60), allowNull: true },
  original_price:   { type: DataTypes.STRING(60), allowNull: true },
  text_position:    { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'left' },
  overlay_opacity:  { type: DataTypes.FLOAT,      allowNull: false, defaultValue: 0.35 },
  order:            { type: DataTypes.INTEGER,    allowNull: false, defaultValue: 0 },
  link_url:         { type: DataTypes.STRING(512),allowNull: true }, // legacy
  is_active:        { type: DataTypes.BOOLEAN,    defaultValue: true },
}, {
  tableName: 'banners',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Banner;
