const { Product, Category } = require("../models");
const { Op } = require("sequelize");

exports.getAllProducts = async (req, res, next) => {
  try {
    // 1. Tangkap Query Parameter dari URL Frontend (berikan nilai default jika kosong)
    const page = parseInt(req.query.page) || 1; // Default: Halaman 1
    const limit = parseInt(req.query.limit) || 10; // Default: 10 produk per halaman
    const search = req.query.search || ""; // Default: Tanpa kata kunci
    const categoryId = req.query.category || null; // Default: Semua kategori
    

    // 2. Hitung Offset (Rumus: data dimulai dari baris ke berapa di database)
    const offset = (page - 1) * limit;

    // 3. Siapkan Keranjang Kondisi (WHERE Clause)
    let whereCondition = {};

    // Jika ada pencarian nama (Misal: ?search=sepatu)
    if (search) {
      whereCondition.name = {
        [Op.like]: `%${search}%`, // Cari kata yang mengandung "sepatu" di mana saja
      };
    }

    // Jika ada filter kategori (Misal: ?category=2)
    if (categoryId) {
      whereCondition.category_id = categoryId;
    }

    // 4. Eksekusi Query menggunakan findAndCountAll
    // (Method ini spesial karena mengembalikan 'rows' untuk datanya, dan 'count' untuk totalnya)
    const products = await Product.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"], // Hanya ambil ID dan Nama Kategorinya agar rapi
        },
      ],
    });

    // 5. Hitung Total Halaman
    const totalPages = Math.ceil(products.count / limit);

    // 6. Kirim Response beserta Metadata Pagination
    res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data produk",
      data: products.rows,
      // Metadata ini SANGAT DIBUTUHKAN Frontend untuk membuat tombol 1, 2, 3, Next, Prev
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
