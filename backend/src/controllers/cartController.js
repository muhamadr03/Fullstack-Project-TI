const { Cart, Product, ProductImage, ProductVariant, VariantAttribute } = require("../models");

exports.getCart = async (req, res) => {
  try {
    // Mencari keranjang milik user yang sedang login, beserta detail produknya
    const cartItems = await Cart.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "price"],
          include: [{ model: ProductImage, as: "images", attributes: ["image_url", "is_primary"] }],
        },
        {
          model: ProductVariant,
          as: "variant",
          attributes: ["id", "sku", "price", "stock"],
          include: [{ model: VariantAttribute, as: "attributes", attributes: ["attribute_name", "attribute_value"] }],
        },
      ],
    });
    res.status(200).json(cartItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil keranjang.", error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { product_id, variant_id, quantity, selected_image_url, selected_size } = req.body;

    // 🔍 Ambil data produk
    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(404).json({
        message: "Produk tidak ditemukan",
      });
    }

    let variant = null;
    let availableStock = product.stock;

    if (variant_id) {
      variant = await ProductVariant.findByPk(variant_id);
      if (!variant) {
        return res.status(404).json({ message: "Varian produk tidak ditemukan" });
      }
      availableStock = variant.stock;
    }

    const qty = quantity || 1;

    // 🔥 Cek apakah produk sudah ada di cart dengan varian yang persis sama
    let cartItem = await Cart.findOne({
      where: { 
        user_id: req.user.id, 
        product_id,
        variant_id: variant_id || null,
        selected_image_url: selected_image_url || null,
        selected_size: selected_size || null
      },
    });

    // 🔥 VALIDASI STOK
    if (cartItem) {
      const totalQty = cartItem.quantity + qty;

      if (totalQty > availableStock) {
        return res.status(400).json({
          message: "Stock tidak mencukupi",
        });
      }

      cartItem.quantity = totalQty;
      await cartItem.save();
    } else {
      if (qty > availableStock) {
        return res.status(400).json({
          message: "Stock tidak mencukupi",
        });
      }

      cartItem = await Cart.create({
        user_id: req.user.id,
        product_id,
        variant_id: variant_id || null,
        quantity: qty,
        selected_image_url: selected_image_url || null,
        selected_size: selected_size || null,
      });
    }

    res.status(200).json({
      message: "Barang berhasil ditambahkan ke keranjang!",
      data: cartItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menambahkan ke keranjang.",
      error: error.message,
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    // Hapus barang dari keranjang HANYA JIKA milik user yang sedang login
    await Cart.destroy({ where: { id, user_id: req.user.id } });
    res
      .status(200)
      .json({ message: "Barang berhasil dihapus dari keranjang." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menghapus barang.", error: error.message });
  }
};
