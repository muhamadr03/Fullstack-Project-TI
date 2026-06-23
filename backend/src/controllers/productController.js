const { Product, Category, ProductImage } = require("../models");
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
      include: [
        includeCondition,
        { model: ProductImage, as: "images", attributes: ["id", "image_url", "is_primary"] }
      ],
      distinct: true, // important when using limit with includes
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
      include: [
        { model: Category, as: "category", attributes: ["id", "name", "slug"] },
        { model: ProductImage, as: "images", attributes: ["id", "image_url", "is_primary"] }
      ],
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

    const newProduct = await Product.create({
      category_id,
      name,
      description,
      price,
      stock,
    });

    const imageRecords = [];
    let hasPrimary = false;

    for (let i = 1; i <= 3; i++) {
      const fileArray = req.files && req.files[`image_${i}`] ? req.files[`image_${i}`] : [];
      if (fileArray.length > 0) {
        const file = fileArray[0];
        imageRecords.push({
          product_id: newProduct.id,
          image_url: file.path,
          is_primary: !hasPrimary, // First image found becomes primary
        });
        hasPrimary = true;
      }
    }

    if (imageRecords.length > 0) {
      await ProductImage.bulkCreate(imageRecords);
    }

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
    delete updateData.existing_image_1;
    delete updateData.existing_image_2;
    delete updateData.existing_image_3;

    await Product.update(
      updateData,
      { where: { id: req.params.id } }
    );

    const updateImages = [];
    let hasPrimary = false;

    for (let i = 1; i <= 3; i++) {
      const fileArray = req.files && req.files[`image_${i}`] ? req.files[`image_${i}`] : [];
      const existingUrl = req.body[`existing_image_${i}`];

      if (fileArray.length > 0) {
        // Ada gambar baru di slot i
        const file = fileArray[0];
        updateImages.push({
          product_id: req.params.id,
          image_url: file.path,
          is_primary: !hasPrimary,
        });
        hasPrimary = true;
      } else if (existingUrl) {
        // Pertahankan gambar lama di slot i
        updateImages.push({
          product_id: req.params.id,
          image_url: existingUrl,
          is_primary: !hasPrimary,
        });
        hasPrimary = true;
      }
    }

    // Hanya jika ada array updateImages kita reset tabelnya (atau jika user mengirim req, kita reset dan isi)
    // Sebenarnya pada update, kita hapus semua gambar lama dari db dan masukkan yg baru sesuai urutan dari updateImages
    await ProductImage.destroy({ where: { product_id: req.params.id } });
    if (updateImages.length > 0) {
      await ProductImage.bulkCreate(updateImages);
    }

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
