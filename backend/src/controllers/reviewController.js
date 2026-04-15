const { Review, User } = require("../models");

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
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil ulasan." });
  }
};
