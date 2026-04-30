const { Cart, Product } = require("../models");

exports.getCart = async (req, res) => {
  try {
    // Mencari keranjang milik user yang sedang login, beserta detail produknya
    const cartItems = await Cart.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["name", "price", "image_url"],
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
    const { product_id, quantity } = req.body;

    // 🔍 Ambil data produk
    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(404).json({
        message: "Produk tidak ditemukan",
      });
    }

    const qty = quantity || 1;

    // 🔥 Cek apakah produk sudah ada di cart
    let cartItem = await Cart.findOne({
      where: { user_id: req.user.id, product_id },
    });

    // 🔥 VALIDASI STOK
    if (cartItem) {
      const totalQty = cartItem.quantity + qty;

      if (totalQty > product.stock) {
        return res.status(400).json({
          message: "Stock tidak mencukupi",
        });
      }

      cartItem.quantity = totalQty;
      await cartItem.save();
    } else {
      if (qty > product.stock) {
        return res.status(400).json({
          message: "Stock tidak mencukupi",
        });
      }

      cartItem = await Cart.create({
        user_id: req.user.id,
        product_id,
        quantity: qty,
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
