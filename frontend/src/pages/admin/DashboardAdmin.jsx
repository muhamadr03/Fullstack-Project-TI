import React, { useState, useEffect } from "react";
import { dashboardApi } from "../../api/dashboardApi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

// Custom Tooltip untuk chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          padding: "10px 16px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          fontSize: "0.85rem",
        }}
      >
        <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>{label}</p>
        <p style={{ margin: "4px 0 0", color: "#4f46e5" }}>
          Rp {Number(payload[0].value).toLocaleString("id-ID")}
        </p>
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    monthlySales: [],
    lowStockProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardApi.getStats();
      if (response.data?.success) {
        setStats({
          totalProducts: response.data.data.totalProducts || 0,
          totalOrders: response.data.data.totalOrders || 0,
          totalCustomers: response.data.data.totalCustomers || 0,
          totalRevenue: response.data.data.totalRevenue || 0,
          monthlySales: response.data.data.monthlySales || [],
          lowStockProducts: response.data.data.lowStockProducts || [],
        });
      }
    } catch (err) {
      console.error("Gagal mengambil statistik:", err);
      setError("Gagal memuat data dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error)
    return (
      <div className="p-4">
        <ErrorMessage message={error} onRetry={fetchStats} />
      </div>
    );

  // Hitung apakah ada kenaikan pendapatan di bulan ini vs bulan lalu
  const salesLen = stats.monthlySales.length;
  const currentMonthSales = salesLen > 0 ? stats.monthlySales[salesLen - 1]?.sales : 0;
  const prevMonthSales = salesLen > 1 ? stats.monthlySales[salesLen - 2]?.sales : 0;
  const salesGrowth =
    prevMonthSales > 0
      ? (((currentMonthSales - prevMonthSales) / prevMonthSales) * 100).toFixed(1)
      : null;

  const statCards = [
    {
      label: "Total Pendapatan",
      value: `Rp ${Number(stats.totalRevenue).toLocaleString("id-ID")}`,
      icon: "bi-wallet2",
      colorClass: "orange",
      growth: salesGrowth !== null ? `${salesGrowth > 0 ? "+" : ""}${salesGrowth}%` : null,
      growthUp: salesGrowth > 0,
    },
    {
      label: "Total Pelanggan",
      value: stats.totalCustomers.toLocaleString("id-ID"),
      icon: "bi-people",
      colorClass: "green",
    },
    {
      label: "Total Pesanan",
      value: stats.totalOrders.toLocaleString("id-ID"),
      icon: "bi-cart3",
      colorClass: "blue",
    },
    {
      label: "Total Produk",
      value: stats.totalProducts.toLocaleString("id-ID"),
      icon: "bi-box-seam",
      colorClass: "yellow",
      badge:
        stats.lowStockProducts.length > 0
          ? `${stats.lowStockProducts.length} stok menipis`
          : null,
    },
  ];

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Dashboard</h2>
          <p className="text-muted mb-0" style={{ fontSize: "0.875rem" }}>
            Ringkasan analitik dan status toko Anda.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
        >
          <i className="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>

      {/* STATISTIC CARDS */}
      <div className="row g-3 mb-4">
        {statCards.map((card, i) => (
          <div className="col-12 col-sm-6 col-xl-3" key={i}>
            <div className="zenith-card p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <p className="zenith-card-title mb-1">{card.label}</p>
                  {card.badge && (
                    <span
                      className="badge"
                      style={{
                        background: "#fef2f2",
                        color: "#dc2626",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                      }}
                    >
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      {card.badge}
                    </span>
                  )}
                </div>
                <div className={`icon-wrapper ${card.colorClass}`}>
                  <i className={`bi ${card.icon}`}></i>
                </div>
              </div>
              <div className="zenith-card-value">{card.value}</div>
              {card.growth && (
                <div className="mt-2">
                  <span
                    className={card.growthUp ? "zenith-badge-success" : "zenith-badge-danger"}
                  >
                    <i
                      className={`bi ${card.growthUp ? "bi-arrow-up-right" : "bi-arrow-down-right"} me-1`}
                    ></i>
                    {card.growth} vs bulan lalu
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CHART + STOCK WARNING */}
      <div className="row g-4">
        {/* CHART */}
        <div className="col-lg-8">
          <div className="zenith-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="fw-bold mb-0">Grafik Penjualan Bulanan</h5>
                <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
                  Data pendapatan 6 bulan terakhir
                </p>
              </div>
              {salesGrowth !== null && (
                <span
                  style={{
                    background: salesGrowth > 0 ? "#f0fdf4" : "#fef2f2",
                    color: salesGrowth > 0 ? "#16a34a" : "#dc2626",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  <i
                    className={`bi ${salesGrowth > 0 ? "bi-arrow-up-right" : "bi-arrow-down-right"} me-1`}
                  ></i>
                  {salesGrowth > 0 ? "+" : ""}
                  {salesGrowth}%
                </span>
              )}
            </div>

            {/* Cek apakah ada data */}
            {stats.monthlySales.every((m) => m.sales === 0) ? (
              <div
                className="d-flex flex-column align-items-center justify-content-center"
                style={{ height: "280px", color: "#94a3b8" }}
              >
                <i className="bi bi-bar-chart-line fs-1 mb-3"></i>
                <p className="mb-0 fw-semibold">Belum ada data penjualan</p>
                <p className="small mt-1">Data akan muncul saat ada pesanan yang selesai.</p>
              </div>
            ) : (
              <div style={{ height: "280px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={stats.monthlySales}
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      dx={-10}
                      tickFormatter={(value) =>
                        value >= 1000000
                          ? `${(value / 1000000).toFixed(1)}jt`
                          : value >= 1000
                          ? `${(value / 1000).toFixed(0)}rb`
                          : value
                      }
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      fill="url(#salesGradient)"
                      dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 6, fill: "#6366f1" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* PERINGATAN STOK */}
        <div className="col-lg-4">
          <div className="zenith-card h-100" style={{ overflow: "hidden" }}>
            <div
              className="p-4"
              style={{
                borderBottom: "1px solid #f1f5f9",
                background:
                  stats.lowStockProducts.length > 0 ? "#fef2f2" : "#f0fdf4",
              }}
            >
              <h5
                className="fw-bold mb-0"
                style={{
                  color:
                    stats.lowStockProducts.length > 0 ? "#dc2626" : "#16a34a",
                  fontSize: "1rem",
                }}
              >
                <i
                  className={`bi ${
                    stats.lowStockProducts.length > 0
                      ? "bi-exclamation-triangle-fill"
                      : "bi-shield-check-fill"
                  } me-2`}
                ></i>
                {stats.lowStockProducts.length > 0
                  ? "Peringatan Stok"
                  : "Stok Aman"}
              </h5>
              {stats.lowStockProducts.length > 0 && (
                <p
                  className="mb-0 mt-1"
                  style={{ fontSize: "0.78rem", color: "#dc2626" }}
                >
                  {stats.lowStockProducts.length} produk membutuhkan restock
                </p>
              )}
            </div>

            <div>
              {stats.lowStockProducts.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {stats.lowStockProducts.map((product) => (
                    <li
                      key={product.id}
                      className="list-group-item d-flex justify-content-between align-items-center px-4 py-3"
                      style={{ border: "none", borderBottom: "1px solid #f1f5f9" }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div
                          className="fw-semibold text-truncate"
                          style={{ fontSize: "0.875rem", maxWidth: "160px" }}
                        >
                          {product.name}
                        </div>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.72rem" }}
                        >
                          ID: #{product.id}
                        </div>
                      </div>
                      <span
                        className="badge rounded-pill flex-shrink-0"
                        style={{
                          background:
                            product.stock === 0 ? "#7f1d1d" : "#fef2f2",
                          color: product.stock === 0 ? "#fff" : "#dc2626",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          padding: "5px 12px",
                        }}
                      >
                        {product.stock === 0 ? "Habis" : `Sisa: ${product.stock}`}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-5 text-center" style={{ color: "#94a3b8" }}>
                  <i
                    className="bi bi-check-circle-fill d-block mb-3"
                    style={{ fontSize: "2.5rem", color: "#10b981" }}
                  ></i>
                  <p className="fw-semibold mb-1" style={{ color: "#374151" }}>
                    Semua stok aman!
                  </p>
                  <p className="small mb-0">
                    Tidak ada produk dengan stok menipis.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
