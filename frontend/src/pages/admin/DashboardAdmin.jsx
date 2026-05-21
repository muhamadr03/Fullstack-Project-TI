import React, { useState, useEffect } from "react";
import { dashboardApi } from "../../api/dashboardApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

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
  if (error) return <div className="p-4"><ErrorMessage message={error} onRetry={fetchStats} /></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Ringkasan analitik dan status toko Anda.</p>
        </div>
      </div>

      {/* STATISTIC CARDS */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card p-4 border-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="text-muted mb-0 fw-semibold">Total Pendapatan</h6>
              <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3">
                <i className="bi bi-wallet2 fs-5"></i>
              </div>
            </div>
            <h3 className="fw-bold mb-0">Rp {stats.totalRevenue.toLocaleString("id-ID")}</h3>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card p-4 border-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="text-muted mb-0 fw-semibold">Total Pelanggan</h6>
              <div className="bg-success bg-opacity-10 text-success p-2 rounded-3">
                <i className="bi bi-people fs-5"></i>
              </div>
            </div>
            <h3 className="fw-bold mb-0">{stats.totalCustomers}</h3>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card p-4 border-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="text-muted mb-0 fw-semibold">Total Pesanan</h6>
              <div className="bg-info bg-opacity-10 text-info p-2 rounded-3">
                <i className="bi bi-cart fs-5"></i>
              </div>
            </div>
            <h3 className="fw-bold mb-0">{stats.totalOrders}</h3>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card p-4 border-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="text-muted mb-0 fw-semibold">Total Produk</h6>
              <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-3">
                <i className="bi bi-box-seam fs-5"></i>
              </div>
            </div>
            <h3 className="fw-bold mb-0">{stats.totalProducts}</h3>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* CHART SECTION */}
        <div className="col-lg-8">
          <div className="card border-0 h-100 p-4">
            <h5 className="fw-bold mb-4">Grafik Penjualan Bulanan</h5>
            <div style={{ height: "300px", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "#6b7280"}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: "#6b7280"}} dx={-10} tickFormatter={(value) => `Rp${value/1000}k`} />
                  <Tooltip 
                    formatter={(value) => [`Rp ${value.toLocaleString("id-ID")}`, "Pendapatan"]}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* LOW STOCK TABLE SECTION */}
        <div className="col-lg-4">
          <div className="card border-0 h-100 p-0 overflow-hidden">
            <div className="p-4 border-bottom bg-light bg-opacity-50">
              <h5 className="fw-bold mb-0 text-danger">
                <i className="bi bi-exclamation-triangle-fill me-2"></i> Peringatan Stok
              </h5>
            </div>
            <div className="p-0">
              {stats.lowStockProducts.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {stats.lowStockProducts.map((product) => (
                    <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center p-3">
                      <div>
                        <h6 className="mb-0 fw-semibold">{product.name}</h6>
                        <small className="text-muted">ID: {product.id}</small>
                      </div>
                      <span className="badge bg-danger rounded-pill px-3 py-2">
                        Sisa: {product.stock}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-5 text-center text-muted">
                  <i className="bi bi-check-circle-fill text-success fs-1 mb-3 d-block"></i>
                  Stok semua produk dalam kondisi aman.
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
