const { Product, Category } = require("../models");

exports.getAllProducts = async (req, res) => {
  try {
    // Kehebatan ORM: otomatis melakukan JOIN ke tabel categories!
    const products = await Product.findAll({
      include: [{ model: Category, as: "category", attributes: ["name"] }],
    });
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server.", error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: "category", attributes: ["name"] }],
    });
    if (!product)
      return res.status(404).json({ message: "Produk tidak ditemukan." });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { category_id, name, description, price, stock } = req.body;

    // Cek apakah ada file yang diunggah
    // Jika ada, buat rute URL-nya. Jika tidak, kosongkan.
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = await Product.create({
      category_id,
      name,
      description,
      price,
      stock,
      image_url, // Simpan rute lokal ini ke database
    });

    res
      .status(201)
      .json({ message: "Produk berhasil ditambahkan!", data: newProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menambahkan produk.", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    // Cek apakah ada file yang diunggah
    // Jika ada, buat rute URL-nya. Jika tidak, gunakan nilai yang sudah ada.
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    await Product.update(
      { ...req.body, image_url },
      { where: { id: req.params.id } }
    );
    res.status(200).json({ message: "Produk berhasil diupdate!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengupdate produk." });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Produk berhasil dihapus." });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus produk." });
  }
};
