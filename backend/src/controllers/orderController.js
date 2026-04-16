const { Order, OrderItem, Cart, Product } = require("../models");

// CUSTOMER: Melakukan Checkout
exports.checkout = async (req, res) => {
  try {
    const { shipping_address } = req.body;

    // 1. Ambil isi keranjang user
    const cartItems = await Cart.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Product, as: "product" }],
    });

    if (cartItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Keranjang belanja Anda kosong!" });
    }

    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          status: "fail",
          message: `Maaf, stok untuk produk ${item.product.name} tidak mencukupi. (Sisa: ${item.product.stock})`,
        });
      }
    }

    // 2. Hitung total harga otomatis
    let totalAmount = 0;
    cartItems.forEach((item) => {
      totalAmount += item.quantity * item.product.price;
    });

    // 3. Buat data Pesanan Utama (Order)
    const newOrder = await Order.create({
      user_id: req.user.id,
      total_amount: totalAmount,
      shipping_address: shipping_address || "Alamat default belum diisi",
      status: "pending",
    });

    // 4. Pindahkan detail barang dari Cart ke OrderItem
    const orderItemsData = cartItems.map((item) => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.product.price,
    }));

    await OrderItem.bulkCreate(orderItemsData); // Insert banyak data sekaligus

    // 5. Kosongkan keranjang user karena sudah jadi pesanan
    await Cart.destroy({ where: { user_id: req.user.id } });

    res
      .status(201)
      .json({ message: "Checkout berhasil!", order_id: newOrder.id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal melakukan checkout.", error: error.message });
  }
};

// CUSTOMER: Melihat Riwayat Pesanannya Sendiri
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product", attributes: ["name"] }],
        },
      ],
    });
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Gagal mengambil riwayat pesanan.",
        error: error.message,
      });
  }
};

// ADMIN: Update Status Resi/Pengiriman
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, tracking_number } = req.body;
    await Order.update(
      { status, tracking_number },
      { where: { id: req.params.id } },
    );
    res.status(200).json({ message: "Status pesanan berhasil diupdate." });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengupdate status pesanan." });
  }
};
