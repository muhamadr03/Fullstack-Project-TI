import React, { useState, useEffect } from "react";
import { orderApi } from "../../api/orderApi";
import StatusBadge from "../../components/ui/StatusBadge";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const API_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const COURIERS = ['JNE', 'J&T Express', 'SiCepat', 'Anteraja', 'Ninja Xpress', 'Pos Indonesia', 'GoSend', 'GrabExpress', 'Lainnya'];

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // State modal pengiriman
  const [shippingModal, setShippingModal] = useState(null);
  const [shippingForm, setShippingForm] = useState({ tracking_number: '', courier: '', notes: '' });
  const [shippingLoading, setShippingLoading] = useState(false);

  // State modal pembatalan (admin)
  const [cancelAdminModal, setCancelAdminModal] = useState(null); // order object
  const [cancelNote, setCancelNote] = useState('');
  const [cancelActionLoading, setCancelActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'cancellation'

  // STATE UNTUK PENCARIAN & PAGINASI
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const handleStatusChange = (orderId, newStatus) => {
    if (newStatus === 'shipped') {
      // Buka modal form pengiriman
      setShippingForm({ tracking_number: '', courier: COURIERS[0], notes: '' });
      setShippingModal({ orderId, newStatus });
      return;
    }
    submitStatusChange(orderId, newStatus, {});
  };

  const submitStatusChange = async (orderId, newStatus, extra = {}) => {
    try {
      setUpdatingId(orderId);
      await orderApi.updateOrderStatus(orderId, { status: newStatus, ...extra });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    if (!shippingForm.tracking_number.trim()) {
      alert('Nomor resi wajib diisi untuk status Dikirim.');
      return;
    }
    setShippingLoading(true);
    try {
      await orderApi.updateOrderStatus(shippingModal.orderId, {
        status: 'shipped',
        tracking_number: shippingForm.tracking_number.trim(),
        courier: shippingForm.courier,
      });
      setShippingModal(null);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal update status pengiriman.');
    } finally {
      setShippingLoading(false);
    }
  };

  const handleViewDetail = (order) => setSelectedOrder(order);
  const handleCloseModal = () => setSelectedOrder(null);

  // Handler persetujuan / penolakan pembatalan (admin)
  const handleCancellationAction = async (action) => {
    setCancelActionLoading(true);
    try {
      await orderApi.handleCancellation(cancelAdminModal.id, action, cancelNote);
      setCancelAdminModal(null);
      setCancelNote('');
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memproses permintaan pembatalan.');
    } finally {
      setCancelActionLoading(false);
    }
  };

  // FUNGSI EXPORT
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Riwayat Pesanan", 14, 20);
    let yPos = 30;
    orders.forEach((order, index) => {
      if (yPos > 270) { doc.addPage(); yPos = 20; }
      doc.setFontSize(10);
      doc.text(
        `${index + 1}. ORD-${order.id} | User: ${order.user_id} | Status: ${order.status} | Total: Rp${order.total_amount}`,
        14, yPos
      );
      yPos += 10;
    });
    doc.save("Laporan_Pesanan.pdf");
  };

  const exportToExcel = () => {
    const formattedData = orders.map((order) => ({
      "Order ID": `ORD-${order.id}`,
      Tanggal: new Date(order.created_at).toLocaleDateString("id-ID"),
      "User ID": order.user_id,
      "Total Tagihan": order.total_amount,
      Status: order.status,
      Resi: order.tracking_number || "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pesanan");
    XLSX.writeFile(workbook, "Laporan_Pesanan.xlsx");
  };

  // LOGIKA FILTER & PAGINASI
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const orderIdMatch = `ord-${order.id}`.toLowerCase().includes(searchLower);
    const statusMatchText = order.status.toLowerCase().includes(searchLower);
    const matchSearch = orderIdMatch || statusMatchText;
    const matchStatus = filterStatus ? order.status === filterStatus : true;

    let matchMonth = true;
    let matchDate = true;

    if (order.created_at) {
      const orderDate = new Date(order.created_at);
      if (filterMonth) {
        const [y, m] = filterMonth.split("-");
        matchMonth =
          orderDate.getFullYear() === parseInt(y, 10) &&
          orderDate.getMonth() + 1 === parseInt(m, 10);
      }
      if (filterDate) {
        const offset = orderDate.getTimezoneOffset() * 60000;
        const localDateStr = new Date(orderDate.getTime() - offset)
          .toISOString()
          .split("T")[0];
        matchDate = localDateStr === filterDate;
      }
    }

    return matchSearch && matchStatus && matchMonth && matchDate;
  });

  filteredOrders.sort((a, b) => {
    if (!a.created_at || !b.created_at) return 0;
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortBy === "newest" ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Pesanan dengan permintaan pembatalan aktif
  const cancellationRequests = orders.filter(o => o.cancellation_status === 'requested');

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
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">
          <i className="bi bi-box-seam"></i> Manajemen Pesanan
        </h2>
        <div className="d-flex gap-2">
          <button onClick={exportToPDF} className="btn btn-danger btn-sm">
            <i className="bi bi-file-pdf"></i> Export PDF
          </button>
          <button onClick={exportToExcel} className="btn btn-success btn-sm">
            <i className="bi bi-file-excel"></i> Export Excel
          </button>
          <button onClick={fetchOrders} className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-clockwise"></i> Refresh Data
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* TAB NAVIGASI */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <i className="bi bi-list-ul me-1"></i>Semua Pesanan
            <span className="badge bg-secondary ms-2">{orders.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === 'cancellation' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancellation')}
          >
            <i className="bi bi-x-circle me-1"></i>Permintaan Pembatalan
            {cancellationRequests.length > 0 && (
              <span className="badge bg-danger ms-2">{cancellationRequests.length}</span>
            )}
          </button>
        </li>
      </ul>
      {/* ── TAB: Semua Pesanan ── */}
      {activeTab === 'all' && (
      <>
      {/* FILTER & PENCARIAN */}
      <div className="row mb-3 gy-2">
        <div className="col-md-3">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Cari ID/Status..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="col-md-3">
          <div className="input-group">
            <span className="input-group-text bg-white" title="Filter Bulan">
              <i className="bi bi-calendar-month"></i>
            </span>
            <input
              type="month"
              className="form-control"
              value={filterMonth}
              onChange={(e) => { setFilterMonth(e.target.value); setFilterDate(""); setCurrentPage(1); }}
              title="Filter berdasarkan Bulan"
            />
          </div>
        </div>
        <div className="col-md-2">
          <div className="input-group">
            <span className="input-group-text bg-white" title="Pencarian Tanggal">
              <i className="bi bi-calendar-date"></i>
            </span>
            <input
              type="date"
              className="form-control"
              value={filterDate}
              onChange={(e) => { setFilterDate(e.target.value); setFilterMonth(""); setCurrentPage(1); }}
              title="Pencarian berdasarkan Tanggal"
            />
          </div>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
        </div>
      </div>

      {/* TABEL PESANAN */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="ps-3">Order ID</th>
                  <th>Tanggal</th>
                  <th>Pembeli</th>
                  <th>Total Tagihan</th>
                  <th>Status</th>
                  <th>Kurir & Resi</th>
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
                      <td>{new Date(order.created_at).toLocaleDateString("id-ID")}</td>
                      <td>
                        {order.user ? (
                          <div>
                            <div className="fw-semibold">{order.user.name}</div>
                            <small className="text-muted">{order.user.email}</small>
                          </div>
                        ) : (
                          <span className="badge bg-light text-dark border">User ID: {order.user_id}</span>
                        )}
                      </td>
                      <td className="fw-bold text-success">
                        Rp {order.total_amount?.toLocaleString("id-ID")}
                      </td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td>
                        {order.courier && (
                          <div className="fw-semibold" style={{ fontSize: '0.85rem' }}>
                            <i className="bi bi-truck me-1 text-primary"></i>{order.courier}
                          </div>
                        )}
                        {order.tracking_number ? (
                          <code style={{ fontSize: '0.8rem' }}>{order.tracking_number}</code>
                        ) : (
                          <span className="text-muted" style={{ fontSize: '0.8rem' }}>-</span>
                        )}
                      </td>
                      <td className="pe-3 text-center">
                        <div className="d-flex align-items-center gap-2 justify-content-center">
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => handleViewDetail(order)}
                            title="Lihat Detail"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <select
                            className="form-select form-select-sm d-inline-block w-auto"
                            value={order.status}
                            disabled={
                              updatingId === order.id ||
                              order.status === "completed" ||
                              order.status === "cancelled"
                            }
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          {updatingId === order.id && (
                            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* PAGINASI */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                Sebelumnya
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => paginate(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                Selanjutnya
              </button>
            </li>
          </ul>
        </nav>
      )}

      </>
      )}

      {/* ── TAB: Permintaan Pembatalan ── */}
      {activeTab === 'cancellation' && (
        <div>
          {cancellationRequests.length === 0 ? (
            <div className="text-center py-5 bg-white rounded shadow-sm">
              <i className="bi bi-check-circle-fill text-success display-4 mb-3 d-block"></i>
              <h5 className="fw-bold text-muted">Tidak ada permintaan pembatalan aktif</h5>
            </div>
          ) : (
            <div className="card shadow-sm border-0">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th className="ps-3">Order ID</th>
                        <th>Pembeli</th>
                        <th>Total</th>
                        <th>Status Pesanan</th>
                        <th>Alasan Pembatalan</th>
                        <th className="text-center pe-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cancellationRequests.map(order => (
                        <tr key={order.id}>
                          <td className="ps-3 fw-bold text-primary">#ORD-{order.id}</td>
                          <td>
                            <div className="fw-semibold">{order.user?.name || '-'}</div>
                            <small className="text-muted">{order.user?.email || '-'}</small>
                          </td>
                          <td className="fw-bold text-success">
                            Rp {Number(order.total_amount || 0).toLocaleString('id-ID')}
                          </td>
                          <td>
                            <StatusBadge status={order.status} />
                          </td>
                          <td>
                            <span className="text-muted" style={{ fontSize: '0.88rem' }}>
                              {order.cancellation_reason || '-'}
                            </span>
                          </td>
                          <td className="text-center pe-3">
                            <div className="d-flex gap-2 justify-content-center">
                              <button
                                className="btn btn-success btn-sm fw-semibold px-3"
                                onClick={() => { setCancelAdminModal(order); setCancelNote(''); }}
                              >
                                <i className="bi bi-check-circle me-1"></i>Tinjau
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MODAL TINJAU PEMBATALAN (ADMIN) ── */}
      {cancelAdminModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} onClick={() => setCancelAdminModal(null)} />
          <div className="modal d-block fade show" tabIndex="-1" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: 16, overflow: 'hidden' }}>
                <div className="modal-header" style={{ background: 'linear-gradient(135deg,#6c757d,#adb5bd)', color: '#fff' }}>
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-clipboard-check me-2"></i>Tinjau Permintaan Pembatalan
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setCancelAdminModal(null)}></button>
                </div>
                <div className="modal-body p-4">
                  {/* Info pesanan */}
                  <div className="p-3 mb-4 rounded-3 bg-light border">
                    <div className="d-flex gap-3 align-items-start">
                      <i className="bi bi-receipt text-secondary fs-4"></i>
                      <div>
                        <div className="fw-bold">Pesanan #ORD-{cancelAdminModal.id}</div>
                        <div className="text-muted small">
                          Pembeli: <strong>{cancelAdminModal.user?.name}</strong> · {cancelAdminModal.user?.email}
                        </div>
                        <div className="text-muted small">
                          Total: <strong>Rp {Number(cancelAdminModal.total_amount || 0).toLocaleString('id-ID')}</strong>
                          {' · '}Status: <strong>{cancelAdminModal.status}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alasan dari customer */}
                  <div className="mb-4 p-3 rounded-3" style={{ background: '#fff8e1', border: '1px solid #ffe082' }}>
                    <p className="fw-semibold mb-1 small text-uppercase text-muted">
                      <i className="bi bi-chat-left-text me-1"></i>Alasan dari Customer
                    </p>
                    <p className="mb-0">{cancelAdminModal.cancellation_reason || '-'}</p>
                  </div>

                  {/* Catatan admin */}
                  <div className="mb-2">
                    <label className="form-label fw-semibold">
                      Catatan Admin <span className="text-muted fw-normal">(opsional)</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Tuliskan alasan persetujuan/penolakan untuk customer..."
                      value={cancelNote}
                      onChange={e => setCancelNote(e.target.value)}
                    />
                  </div>
                  {cancelAdminModal.status === 'paid' && (
                    <div className="alert alert-info d-flex gap-2 py-2 mb-0" style={{ borderRadius: 8 }}>
                      <i className="bi bi-info-circle-fill flex-shrink-0"></i>
                      <small>Jika disetujui, stok produk akan dikembalikan secara otomatis.</small>
                    </div>
                  )}
                </div>
                <div className="modal-footer gap-2">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setCancelAdminModal(null)}>
                    Tutup
                  </button>
                  <button
                    className="btn btn-danger fw-semibold px-4"
                    disabled={cancelActionLoading}
                    onClick={() => handleCancellationAction('reject')}
                  >
                    {cancelActionLoading ? <span className="spinner-border spinner-border-sm me-1"></span> : <i className="bi bi-x-circle me-1"></i>}
                    Tolak
                  </button>
                  <button
                    className="btn btn-success fw-semibold px-4"
                    disabled={cancelActionLoading}
                    onClick={() => handleCancellationAction('approve')}
                  >
                    {cancelActionLoading ? <span className="spinner-border spinner-border-sm me-1"></span> : <i className="bi bi-check-circle me-1"></i>}
                    Setujui Pembatalan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODAL DETAIL PESANAN */}
      {selectedOrder && (
        <>
          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            onClick={handleCloseModal}
            style={{ zIndex: 1040 }}
          ></div>

          {/* Modal */}
          <div
            className="modal d-block fade show"
            tabIndex="-1"
            style={{ zIndex: 1045 }}
            onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
          >
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
              <div className="modal-content">
                {/* Header */}
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-receipt me-2"></i>
                    Detail Pesanan #ORD-{selectedOrder.id}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={handleCloseModal}
                    aria-label="Tutup"
                  ></button>
                </div>

                {/* Body */}
                <div className="modal-body">
                  {/* Info Pembeli & Pengiriman */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h6 className="fw-bold text-muted text-uppercase small mb-2">
                        <i className="bi bi-person-fill me-1"></i>Info Pembeli
                      </h6>
                      <p className="mb-1 fw-bold">{selectedOrder.user?.name || "-"}</p>
                      <p className="mb-0 text-muted">{selectedOrder.user?.email || "-"}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold text-muted text-uppercase small mb-2">
                        <i className="bi bi-calendar-event me-1"></i>Tanggal
                      </h6>
                      <p className="mb-0">
                        {selectedOrder.created_at
                          ? new Date(selectedOrder.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "-"}
                      </p>
                    </div>
                  </div>

                  {/* Alamat Pengiriman */}
                  <div className="mb-4">
                    <h6 className="fw-bold text-muted text-uppercase small mb-2">
                      <i className="bi bi-geo-alt-fill me-1"></i>Alamat Pengiriman
                    </h6>
                    <div className="p-3 bg-light rounded border">
                      {selectedOrder.shipping_address || (
                        <span className="text-muted">-</span>
                      )}
                    </div>
                  </div>

                  {/* Tabel Item */}
                  <h6 className="fw-bold text-muted text-uppercase small mb-2">
                    <i className="bi bi-bag-fill me-1"></i>Item Pesanan
                  </h6>
                  <div className="table-responsive mb-3">
                    <table className="table table-bordered align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Produk</th>
                          <th className="text-center">Qty</th>
                          <th className="text-end">Harga Satuan</th>
                          <th className="text-end">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedOrder.items || selectedOrder.order_items || []).map((item, idx) => (
                          <tr key={idx}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={
                                    item.product?.image_url
                                      ? item.product.image_url.startsWith("http")
                                        ? item.product.image_url
                                        : `${API_URL}${item.product.image_url}`
                                      : "https://via.placeholder.com/40"
                                  }
                                  alt=""
                                  style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                                  onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }}
                                />
                                <span className="fw-semibold">
                                  {item.product?.name || `Produk #${item.product_id}`}
                                </span>
                                {item.selected_size && (
                                  <span className="badge bg-secondary ms-2" style={{ fontSize: "0.7rem" }}>
                                    Varian: {item.selected_size}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-end">
                              Rp {Number(item.price_at_purchase || item.price || 0).toLocaleString("id-ID")}
                            </td>
                            <td className="text-end">
                              Rp {(Number(item.price_at_purchase || item.price || 0) * item.quantity).toLocaleString("id-ID")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="table-light">
                        <tr>
                          <td colSpan="3" className="text-end fw-bold">Total Tagihan</td>
                          <td className="text-end fw-bold text-success">
                            Rp {Number(selectedOrder.total_amount).toLocaleString("id-ID")}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── MODAL FORM PENGIRIMAN ── */}
      {shippingModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} onClick={() => setShippingModal(null)} />
          <div className="modal d-block fade show" tabIndex="-1" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: 16, overflow: 'hidden' }}>
                <div className="modal-header" style={{ background: 'linear-gradient(135deg,#0d6efd,#0099ff)', color: '#fff' }}>
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-truck me-2"></i>Input Info Pengiriman
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShippingModal(null)}></button>
                </div>
                <form onSubmit={handleShippingSubmit}>
                  <div className="modal-body p-4">
                    <div className="alert alert-info d-flex gap-2 align-items-start py-2 mb-4" style={{ borderRadius: 10 }}>
                      <i className="bi bi-info-circle-fill mt-1"></i>
                      <small>Pesanan <strong>#ORD-{shippingModal.orderId}</strong> akan diubah ke status <strong>Dikirim</strong>. Isi nomor resi dan kurir pengiriman.</small>
                    </div>

                    {/* Pilih Kurir */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-truck me-1 text-primary"></i>Jasa Pengiriman
                      </label>
                      <select
                        className="form-select"
                        value={shippingForm.courier}
                        onChange={e => setShippingForm({ ...shippingForm, courier: e.target.value })}
                        required
                      >
                        {COURIERS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    {/* Nomor Resi */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-upc-scan me-1 text-primary"></i>Nomor Resi <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: JNE123456789ID"
                        value={shippingForm.tracking_number}
                        onChange={e => setShippingForm({ ...shippingForm, tracking_number: e.target.value.toUpperCase() })}
                        required
                        style={{ fontFamily: 'monospace', letterSpacing: 1 }}
                      />
                      <div className="form-text">Nomor resi akan ditampilkan kepada pembeli.</div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShippingModal(null)}>Batal</button>
                    <button type="submit" className="btn btn-primary fw-semibold px-4" disabled={shippingLoading}>
                      {shippingLoading
                        ? <><span className="spinner-border spinner-border-sm me-2"></span>Menyimpan...</>
                        : <><i className="bi bi-truck me-1"></i>Konfirmasi Kirim</>
                      }
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageOrdersPage;
