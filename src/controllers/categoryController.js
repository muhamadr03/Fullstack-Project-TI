const { Category } = require("../models");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server.", error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const newCategory = await Category.create({ name, slug });
    res
      .status(201)
      .json({ message: "Kategori berhasil dibuat!", data: newCategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal membuat kategori.", error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.destroy({ where: { id } });
    res.status(200).json({ message: "Kategori berhasil dihapus." });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus kategori." });
  }
};
