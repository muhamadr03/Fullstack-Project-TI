const { Product, Category } = require("../models");
const { Op } = require("sequelize");

exports.getAllProducts = async (req, res, next) => {
  try {
    // 1. Tangkap Query Parameter dari URL Frontend
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const categoryId = req.query.category || null;
    const minPrice = parseInt(req.query.minPrice) || null;
    const maxPrice = parseInt(req.query.maxPrice) || null;
    const sortBy = req.query.sortBy || "terbaru"; // terbaru, termurah, termahal
    
    // 2. Hitung Offset
    const offset = (page - 1) * limit;

    // 3. Siapkan Kondisi (WHERE Clause)
    let whereCondition = {};

    if (search) {
      whereCondition.name = {
        [Op.like]: `%${search}%`,
      };
    }

    if (categoryId) {
      whereCondition.category_id = categoryId;
    }

    if (minPrice !== null || maxPrice !== null) {
      whereCondition.price = {};
      if (minPrice !== null) whereCondition.price[Op.gte] = minPrice;
      if (maxPrice !== null) whereCondition.price[Op.lte] = maxPrice;
    }

    // 4. Tentukan urutan (Order)
    let orderCondition = [["created_at", "DESC"]]; // Default terbaru
    if (sortBy === "termurah") {
      orderCondition = [["price", "ASC"]];
    } else if (sortBy === "termahal") {
      orderCondition = [["price", "DESC"]];
    } else if (sortBy === "terlama") {
      orderCondition = [["created_at", "ASC"]];
    }

    // 5. Eksekusi Query
    const products = await Product.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: orderCondition,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });

    const totalPages = Math.ceil(products.count / limit);

    res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data produk",
      data: products.rows,
      pagination: {
        total_items: products.count,
        total_pages: totalPages,
        current_page: page,
        limit_per_page: limit,
        has_next_page: page < totalPages,
        has_prev_page: page > 1,
      },
    });
  } catch (error) {
    next(error);
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
