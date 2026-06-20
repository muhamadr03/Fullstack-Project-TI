const { Review, User, Order, OrderItem } = require("../models");
const { Op } = require("sequelize");

// CUSTOMER: Menambahkan ulasan
exports.addReview = async (req, res) => {
  try {
    const { product_id, order_id, rating, comment } = req.body;

    // Validasi rating 1 sampai 5
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating harus antara 1 hingga 5." });
    }

    // Validasi: cek apakah order_id milik user ini dan sudah lunas (paid)
    const order = await Order.findOne({
      where: { id: order_id, user_id: req.user.id, status: "paid" },
    });

    if (!order) {
      return res.status(403).json({
        message:
          "Anda hanya dapat mengulas produk dari pesanan yang sudah lunas.",
      });
    }

    // Validasi: cek apakah produk ada dalam order tersebut
    const orderItem = await OrderItem.findOne({
      where: { order_id, product_id },
    });

    if (!orderItem) {
      return res.status(403).json({
        message: "Produk ini tidak ada dalam pesanan tersebut.",
      });
    }

    const newReview = await Review.create({
      user_id: req.user.id,
      product_id,
      order_id,
      rating,
      comment,
    });

    res
      .status(201)
      .json({ message: "Terima kasih atas ulasan Anda!", data: newReview });
  } catch (error) {
    // Menangkap error jika user mencoba spam review (karena aturan unique di model)
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ message: "Anda sudah memberikan ulasan untuk pesanan ini." });
    }
    res
      .status(500)
      .json({ message: "Gagal mengirim ulasan.", error: error.message });
  }
};

// PUBLIK: Melihat ulasan sebuah produk
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { product_id: req.params.productId },
      include: [{ model: User, as: "user", attributes: ["name"] }], // Tampilkan nama pereview
      order: [["created_at", "DESC"]],
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil ulasan." });
  }
};

// CUSTOMER: Ambil daftar order (yang sudah paid) beserta item-nya untuk keperluan review
// Digunakan di frontend agar user bisa pilih dari order mana mereka mau review
exports.getEligibleOrders = async (req, res) => {
  try {
    const { product_id } = req.query;
    const userId = req.user.id;

    // Cari order user yang sudah paid
    const orders = await Order.findAll({
      where: { user_id: userId, status: "paid" },
      include: [
        {
          model: OrderItem,
          as: "items",
          where: product_id ? { product_id } : {},
          required: true,
        },
      ],
    });

    // Filter: keluarkan order yang sudah ada review-nya untuk produk ini
    if (product_id) {
      const existingReviews = await Review.findAll({
        where: { user_id: userId, product_id },
        attributes: ["order_id"],
      });
      const reviewedOrderIds = existingReviews.map((r) => r.order_id);

      const eligibleOrders = orders.filter(
        (o) => !reviewedOrderIds.includes(o.id)
      );

      return res.status(200).json(eligibleOrders);
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error getEligibleOrders:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil daftar pesanan.", error: error.message });
  }
};

// ADMIN: Ambil semua ulasan
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, as: 'user', attributes: ['name', 'email'] },
      ],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json({ success: true, data: reviews });
  } catch (e) { res.status(500).json({ message: 'Gagal mengambil ulasan.', error: e.message }); }
};

// ADMIN: Hapus ulasan
exports.deleteReview = async (req, res) => {
  try {
    const rows = await Review.destroy({ where: { id: req.params.id } });
    if (!rows) return res.status(404).json({ message: 'Ulasan tidak ditemukan.' });
    res.status(200).json({ success: true, message: 'Ulasan berhasil dihapus.' });
  } catch (e) { res.status(500).json({ message: 'Gagal menghapus ulasan.' }); }
};
