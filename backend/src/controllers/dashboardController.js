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

    // 5. Cek peringatan stok menipis (< 5)
    const lowStockProducts = await Product.findAll({
      where: { stock: { [Op.lt]: 5 } },
      attributes: ["id", "name", "stock"],
      order: [["stock", "ASC"]],
      limit: 10,
    });

    // 6. Data Penjualan Bulanan (Untuk Chart - Mock Data / Basic Grouping)
    // Secara ideal, ini di-group menggunakan query SQL yang lebih kompleks.
    // Sebagai permulaan kita sediakan data dummy jika belum ada data riwayat yang panjang, 
    // atau mengambil orders 6 bulan terakhir.
    const monthlySales = [
      { name: "Jan", sales: 4000 },
      { name: "Feb", sales: 3000 },
      { name: "Mar", sales: 5000 },
      { name: "Apr", sales: 4500 },
      { name: "May", sales: 6000 },
      { name: "Jun", sales: 7000 },
    ];

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue: totalRevenue || 0, // Jika null, jadikan 0
        lowStockProducts,
        monthlySales,
      },
    });
  } catch (error) {
    console.error("🔥 Error Dashboard Stats:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil data statistik dashboard" });
  }
};
