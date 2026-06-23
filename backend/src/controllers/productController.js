const { Product, Category } = require("../models");
const { Op } = require("sequelize");

exports.getAllProducts = async (req, res, next) => {
  try {
    // 1. Tangkap Query Parameter dari URL Frontend
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || "";
    const category = req.query.category || null;
    const minPrice = req.query.minPrice ? parseInt(req.query.minPrice, 10) : null;
    const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice, 10) : null;
    const rating = req.query.rating ? parseFloat(req.query.rating) : null;
    const sortBy = req.query.sortBy || "newest"; // newest, price_asc, price_desc, oldest

    // 2. Hitung Offset
    const offset = (page - 1) * limit;

    // 3. Siapkan Kondisi (WHERE Clause)
    let whereCondition = {};
    let includeCondition = {
        model: Category,
        as: "category",
        attributes: ["id", "name", "slug"],
    };

    if (search) {
      whereCondition[Op.or] = [
        {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          description: {
            [Op.like]: `%${search}%`,
          },
        },
      ];
    }

    if (category) {
      const categoryId = Number(category);
      if (!Number.isNaN(categoryId)) {
        // Category passed as ID
        whereCondition.category_id = categoryId;
      } else {
        // Category passed as slug
        includeCondition.where = { slug: category };
        includeCondition.required = true;
      }
    }

    if (minPrice !== null || maxPrice !== null) {
      whereCondition.price = {};
      if (minPrice !== null) whereCondition.price[Op.gte] = minPrice;
      if (maxPrice !== null) whereCondition.price[Op.lte] = maxPrice;
    }

    if (rating !== null) {
      whereCondition.average_rating = {
        [Op.gte]: rating,
      };
    }

    // 4. Tentukan urutan (Order)
    let orderCondition = [["created_at", "DESC"]]; // Default newest
    if (sortBy === "price_asc" || sortBy === "termurah") {
      orderCondition = [["price", "ASC"]];
    } else if (sortBy === "price_desc" || sortBy === "termahal") {
      orderCondition = [["price", "DESC"]];
    } else if (sortBy === "oldest" || sortBy === "terlama") {
      orderCondition = [["created_at", "ASC"]];
    } else if (sortBy === "popular") {
      orderCondition = [
        ["sold_count", "DESC"],
        ["average_rating", "DESC"],
      ];
    }

    // 5. Eksekusi Query
    const products = await Product.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: orderCondition,
      include: [includeCondition],
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
    console.error("❌ [getAllProducts Error]:", error.message);
    next(error);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: "category", attributes: ["id", "name", "slug"] }],
    });
    if (!product)
      return res.status(404).json({ message: "Produk tidak ditemukan." });

    // Parse image_url (koma-separated) menjadi array
    const productData = product.toJSON();
    productData.images = productData.image_url
      ? productData.image_url.split(",").map((url) => url.trim()).filter(Boolean)
      : [];

    res.status(200).json(productData);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { category_id, name, description, price, stock } = req.body;

    // Ambil semua URL gambar dari req.files["images"] (upload.fields)
    let image_url = null;
    const uploadedFiles = req.files && req.files["images"] ? req.files["images"] : [];
    if (uploadedFiles.length > 0) {
      image_url = uploadedFiles.map((file) => file.path).join(",");
    }

    const newProduct = await Product.create({
      category_id,
      name,
      description,
      price,
      stock,
      image_url,
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
    const updateData = { ...req.body };

    const uploadedFiles = req.files && req.files["images"] ? req.files["images"] : [];
    if (uploadedFiles.length > 0) {
      // Ada gambar baru diunggah → replace semua gambar lama
      updateData.image_url = uploadedFiles.map((file) => file.path).join(",");
    } else {
      // Tidak ada gambar baru → pertahankan gambar lama
      delete updateData.image_url;
    }

    await Product.update(
      updateData,
      { where: { id: req.params.id } }
    );
    res.status(200).json({ message: "Produk berhasil diupdate!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengupdate produk.", error: error.message });
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
