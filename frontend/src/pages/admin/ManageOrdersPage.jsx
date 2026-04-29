import React, { useState, useEffect } from "react";
import { orderApi } from "../../api/orderApi";

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // ==========================================
  // STATE UNTUK PENCARIAN & PAGINASI
  // ==========================================
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Jumlah pesanan per halaman

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getAllOrders();
      setOrders(response.data || []);
    } catch (err) {
      console.error("Gagal memuat pesanan:", err);
      setError("Gagal mengambil data pesanan.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    let trackingNumber = "";
    if (newStatus === "shipped") {
      trackingNumber = window.prompt(
        "Masukkan Nomor Resi Pengiriman (Opsional):",
      );
      if (trackingNumber === null) return;
    }

    try {
      setUpdatingId(orderId);
      await orderApi.updateOrderStatus(orderId, {
        status: newStatus,
        tracking_number: trackingNumber,
      });
      alert("Status pesanan berhasil diperbarui!");
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="badge bg-warning text-dark">Pending</span>;
      case "paid":
        return <span className="badge bg-info text-dark">Sudah Dibayar</span>;
      case "shipped":
        return <span className="badge bg-primary">Sedang Dikirim</span>;
      case "completed":
        return <span className="badge bg-success">Selesai</span>;
      case "cancelled":
        return <span className="badge bg-danger">Dibatalkan</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  // ==========================================
  // LOGIKA PENCARIAN & PAGINASI
  // ==========================================
  // 1. Filter data berdasarkan pencarian
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const orderIdMatch = `ord-${order.id}`.toLowerCase().includes(searchLower);
    const statusMatch = order.status.toLowerCase().includes(searchLower);
    // Bisa tambah pencarian berdasar ID Pembeli jika perlu
    return orderIdMatch || statusMatch;
  });

  // 2. Hitung total halaman
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // 3. Potong data untuk halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  // Fungsi ganti halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">
          <i className="bi bi-box-seam"></i> Manajemen Pesanan
        </h2>
        <button
          onClick={fetchOrders}
          className="btn btn-outline-secondary btn-sm"
        >
          <i className="bi bi-arrow-clockwise"></i> Refresh Data
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* KOLOM PENCARIAN */}
      <div className="row mb-3">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Cari Order ID atau Status..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset ke halaman 1 tiap kali mencari
              }}
            />
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="ps-3">Order ID</th>
                  <th>Tanggal</th>
                  <th>ID Pembeli</th>
                  <th>Total Tagihan</th>
                  <th>Status & Resi</th>
                  <th className="text-center pe-3">Aksi Admin</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      Pesanan tidak ditemukan.
                    </td>
                  </tr>
                ) : (
                  currentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="ps-3 fw-bold">#ORD-{order.id}</td>
                      <td>
                        {new Date(order.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          User ID: {order.user_id}
                        </span>
                      </td>
                      <td className="fw-bold text-success">
                        Rp {order.total_amount?.toLocaleString("id-ID")}
                      </td>
                      <td>
                        <div className="mb-1">
                          {getStatusBadge(order.status)}
                        </div>
                        {order.tracking_number && (
                          <small className="text-muted d-block">
                            Resi: {order.tracking_number}
                          </small>
                        )}
                      </td>
                      <td className="pe-3 text-center">
                        <select
                          className="form-select form-select-sm d-inline-block w-auto"
                          value={order.status}
                          disabled={
                            updatingId === order.id ||
                            order.status === "completed" ||
                            order.status === "cancelled"
                          }
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        {updatingId === order.id && (
                          <div
                            className="spinner-border spinner-border-sm text-primary ms-2"
                            role="status"
                          ></div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* KONTROL PAGINASI */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
              >
                Sebelumnya
              </button>
            </li>

            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
              >
                Selanjutnya
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ManageOrdersPage;
