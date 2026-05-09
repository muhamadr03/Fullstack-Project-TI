const { Product, Order, User } = require("../models");
const { Op } = require("sequelize");

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Hitung total produk
    const totalProducts = await Product.count();

    // 2. Hitung total pesanan keseluruhan
    const totalOrders = await Order.count();

    // 3. Hitung total pelanggan (customer)
    const totalCustomers = await User.count({
      where: { role: "customer" },
    });

    // 4. Hitung total pendapatan (hanya dari pesanan yang sudah dibayar/selesai)
    const totalRevenue = await Order.sum("total_amount", {
      where: {
        status: {
          [Op.in]: ["paid", "shipped", "completed"],
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue: totalRevenue || 0, // Jika null, jadikan 0
      },
    });
  } catch (error) {
    console.error("🔥 Error Dashboard Stats:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil data statistik dashboard" });
  }
};
