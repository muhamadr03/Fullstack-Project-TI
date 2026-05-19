import React, { useState, useEffect } from "react";
import { dashboardApi } from "../../api/dashboardApi";

const DashboardPage = () => {
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
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: "#0f172a" }}>Dashboard</h2>
          <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>Ringkasan analitik dan penjualan toko Anda hari ini.</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {/* Total Revenue Card */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="zenith-card d-flex flex-column h-100">
            <div className="p-3 pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="zenith-card-title">Total Pendapatan</div>
                <div className="zenith-card-value">
                  Rp {stats.totalRevenue.toLocaleString("id-ID")}
                </div>
              </div>
              <div className="icon-wrapper orange">
                <i className="bi bi-wallet2"></i>
              </div>
            </div>
            <div className="mt-auto">
              <svg className="sparkline-svg" preserveAspectRatio="none" viewBox="0 0 100 20">
                <path d="M0,15 Q10,5 20,10 T40,15 T60,5 T80,10 T100,2" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Customers Card */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="zenith-card d-flex flex-column h-100">
            <div className="p-3 pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="zenith-card-title">Total Pelanggan</div>
                <div className="zenith-card-value">{stats.totalCustomers}</div>
              </div>
              <div className="icon-wrapper green">
                <i className="bi bi-people"></i>
              </div>
            </div>
            <div className="mt-auto">
              <svg className="sparkline-svg" preserveAspectRatio="none" viewBox="0 0 100 20">
                <path d="M0,10 Q10,15 20,5 T40,10 T60,2 T80,15 T100,5" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="zenith-card d-flex flex-column h-100">
            <div className="p-3 pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="zenith-card-title">Total Pesanan</div>
                <div className="zenith-card-value">{stats.totalOrders}</div>
              </div>
              <div className="icon-wrapper blue">
                <i className="bi bi-cart"></i>
              </div>
            </div>
            <div className="mt-auto">
              <svg className="sparkline-svg" preserveAspectRatio="none" viewBox="0 0 100 20">
                <path d="M0,5 Q10,10 20,8 T40,15 T60,10 T80,18 T100,12" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Products Card */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="zenith-card d-flex flex-column h-100">
            <div className="p-3 pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="zenith-card-title">Total Produk</div>
                <div className="zenith-card-value">{stats.totalProducts}</div>
              </div>
              <div className="icon-wrapper yellow">
                <i className="bi bi-box-seam"></i>
              </div>
            </div>
            <div className="mt-auto">
              <svg className="sparkline-svg" preserveAspectRatio="none" viewBox="0 0 100 20">
                <path d="M0,18 L20,15 L40,16 L60,10 L80,5 L100,2" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Overview Chart Section (Simplified) */}
      <div className="row g-4">
        <div className="col-12">
          <div className="zenith-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="fw-bold mb-1" style={{ color: "#0f172a" }}>Grafik Pendapatan (Ilustrasi)</h5>
                <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>Performa bulanan toko Anda</p>
              </div>
              <div className="btn-group border rounded-pill" role="group">
                <button type="button" className="btn btn-sm btn-light rounded-pill px-3 fw-bold" style={{ backgroundColor: "#ffffff" }}>Pendapatan</button>
                <button type="button" className="btn btn-sm btn-light rounded-pill px-3 text-muted border-0 bg-transparent">Pesanan</button>
              </div>
            </div>
            
            <div className="chart-placeholder w-100">
              {/* Fake grid lines */}
              <div className="d-flex flex-column justify-content-between h-100 pb-4" style={{ borderLeft: "1px solid #f1f5f9", paddingLeft: "10px" }}>
                <div className="text-muted border-bottom w-100" style={{ fontSize: "0.75rem", paddingBottom: "5px", borderColor: "#f1f5f9" }}>$60k</div>
                <div className="text-muted border-bottom w-100" style={{ fontSize: "0.75rem", paddingBottom: "5px", borderColor: "#f1f5f9" }}>$45k</div>
                <div className="text-muted border-bottom w-100" style={{ fontSize: "0.75rem", paddingBottom: "5px", borderColor: "#f1f5f9" }}>$30k</div>
                <div className="text-muted border-bottom w-100" style={{ fontSize: "0.75rem", paddingBottom: "5px", borderColor: "#f1f5f9" }}>$15k</div>
                <div className="text-muted border-bottom w-100" style={{ fontSize: "0.75rem", paddingBottom: "5px", borderColor: "#f1f5f9" }}>$0k</div>
              </div>
              <div className="chart-line w-100"></div>
              <div className="d-flex justify-content-between position-absolute bottom-0 w-100 px-3 pb-2 text-muted" style={{ fontSize: "0.75rem" }}>
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
