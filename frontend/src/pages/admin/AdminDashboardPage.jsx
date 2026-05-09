import React, { useState, useEffect } from "react";
import { dashboardApi } from "../../api/dashboardApi";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await dashboardApi.getStats();
        if (response.data?.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil statistik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-speedometer2 me-2"></i>Dashboard Utama
      </h2>

      <div className="row g-4">
        {/* Kartu Total Pendapatan */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 bg-primary text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 fw-semibold text-white-50">
                    Total Pendapatan
                  </p>
                  <h4 className="fw-bold mb-0">
                    Rp {stats.totalRevenue.toLocaleString("id-ID")}
                  </h4>
                </div>
                <div className="fs-1 text-white-50">
                  <i className="bi bi-wallet2"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kartu Total Pesanan */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 bg-success text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 fw-semibold text-white-50">
                    Total Pesanan
                  </p>
                  <h4 className="fw-bold mb-0">{stats.totalOrders}</h4>
                </div>
                <div className="fs-1 text-white-50">
                  <i className="bi bi-cart-check"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kartu Total Produk */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 bg-warning text-dark h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 fw-semibold text-dark-50">Total Produk</p>
                  <h4 className="fw-bold mb-0">{stats.totalProducts}</h4>
                </div>
                <div className="fs-1 text-dark-50">
                  <i className="bi bi-box-seam"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kartu Total Pelanggan */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 bg-info text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 fw-semibold text-white-50">
                    Total Pelanggan
                  </p>
                  <h4 className="fw-bold mb-0">{stats.totalCustomers}</h4>
                </div>
                <div className="fs-1 text-white-50">
                  <i className="bi bi-people"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center py-5">
              <i className="bi bi-stars text-warning fs-1 mb-3"></i>
              <h5>Selamat Datang di Panel Admin!</h5>
              <p className="text-muted">
                Gunakan menu navigasi untuk mengelola pesanan dan katalog produk
                toko Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
