const { Product, Order, User } = require("../models");
const { Op, fn, col, literal } = require("sequelize");
const sequelize = require("../config/db");

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

    // 6. Data Penjualan Bulanan dari database (6 bulan terakhir)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    const rawMonthlySales = await Order.findAll({
      attributes: [
        [fn("MONTH", col("created_at")), "month"],
        [fn("YEAR", col("created_at")), "year"],
        [fn("SUM", col("total_amount")), "sales"],
      ],
      where: {
        created_at: { [Op.gte]: sixMonthsAgo },
        status: { [Op.in]: ["paid", "shipped", "completed"] },
      },
      group: [fn("YEAR", col("created_at")), fn("MONTH", col("created_at"))],
      order: [[fn("YEAR", col("created_at")), "ASC"], [fn("MONTH", col("created_at")), "ASC"]],
      raw: true,
    });

    // Buat array 6 bulan dengan nilai 0 jika tidak ada data
    const monthlySales = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const found = rawMonthlySales.find(
        (r) => parseInt(r.month) === m && parseInt(r.year) === y
      );
      monthlySales.push({
        name: monthNames[m - 1],
        sales: found ? parseFloat(found.sales) : 0,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue: totalRevenue || 0,
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
