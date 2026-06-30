import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import { reviewApi } from '../../api/reviewApi';

const API_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

// ── Konfigurasi status pembatalan ─────────────────────────────────────────────
const CANCEL_STATUS_CONFIG = {
  requested: { label: 'Menunggu Persetujuan Admin', color: 'warning', icon: 'bi-hourglass-split' },
  approved:  { label: 'Pembatalan Disetujui',       color: 'danger',  icon: 'bi-x-circle-fill'  },
  rejected:  { label: 'Pembatalan Ditolak',          color: 'secondary',icon: 'bi-slash-circle'  },
};

// ── Konfigurasi status ────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:   { label: 'Menunggu Pembayaran', color: 'warning',   icon: 'bi-clock-history',        textColor: 'dark' },
  paid:      { label: 'Sudah Dibayar',       color: 'info',      icon: 'bi-check-circle-fill',    textColor: 'white' },
  shipped:   { label: 'Dalam Pengiriman',    color: 'primary',   icon: 'bi-truck',                textColor: 'white' },
  completed: { label: 'Pesanan Selesai',     color: 'success',   icon: 'bi-bag-check-fill',       textColor: 'white' },
  cancelled: { label: 'Dibatalkan',          color: 'danger',    icon: 'bi-x-circle-fill',        textColor: 'white' },
};

// ── Stepper pengiriman ────────────────────────────────────────────────────────
const STEPS = [
  { key: 'created',  label: 'Pesanan Dibuat', icon: 'bi-receipt'          },
  { key: 'paid',     label: 'Pembayaran',     icon: 'bi-credit-card-2-front' },
  { key: 'shipped',  label: 'Dikirim',        icon: 'bi-truck'            },
  { key: 'completed',label: 'Selesai',        icon: 'bi-bag-check-fill'   },
];

const getActiveStep = (status) => {
  if (status === 'cancelled') return -1;
  if (status === 'pending')   return 0;
  if (status === 'paid')      return 1;
  if (status === 'shipped')   return 2;
  if (status === 'completed') return 3;
  return 0;
};

// ── Komponen Kartu Pesanan ────────────────────────────────────────────────────
const OrderCard = ({ order, onPayPending, onConfirmComplete, onRequestCancel, onOpenReviewModal }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg    = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const active = getActiveStep(order.status);
  const isCancelled  = order.status === 'cancelled';
  const isShipped    = order.status === 'shipped';
  const isPending    = order.status === 'pending';
  const canCancel    = ['pending', 'paid'].includes(order.status) && order.cancellation_status !== 'requested';
  const cancelCfg    = order.cancellation_status ? CANCEL_STATUS_CONFIG[order.cancellation_status] : null;

  const handleCopyResi = () => {
    navigator.clipboard.writeText(order.tracking_number);
    alert('Nomor resi disalin!');
  };

  return (
    <div className="card border-0 shadow-sm mb-4 overflow-hidden" style={{ borderRadius: '16px' }}>
      {/* ── Header kartu ── */}
      <div
        className={`d-flex justify-content-between align-items-center px-4 py-3 bg-${cfg.color} bg-opacity-10 border-bottom`}
        style={{ cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center bg-${cfg.color}`}
            style={{ width: 42, height: 42, flexShrink: 0 }}
          >
            <i className={`bi ${cfg.icon} text-white fs-5`}></i>
          </div>
          <div>
            <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
              Pesanan <span className="text-primary">#ORD-{order.id}</span>
            </div>
            <small className="text-muted">
              {new Date(order.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </small>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className={`badge bg-${cfg.color} text-${cfg.textColor} px-3 py-2`} style={{ borderRadius: '20px', fontSize: '0.78rem' }}>
            <i className={`bi ${cfg.icon} me-1`}></i>{cfg.label}
          </span>
          <i className={`bi bi-chevron-${expanded ? 'up' : 'down'} text-muted`}></i>
        </div>
      </div>

      {/* ── Ringkasan selalu tampil ── */}
      <div className="px-4 py-3 d-flex flex-wrap justify-content-between align-items-center gap-2 border-bottom bg-white">
        <div className="d-flex gap-4 flex-wrap">
          <div>
            <small className="text-muted d-block">Total Tagihan</small>
            <span className="fw-bold text-success fs-6">
              Rp {Number(order.total_amount || 0).toLocaleString('id-ID')}
            </span>
          </div>
          {order.discount_amount > 0 && (
            <div>
              <small className="text-muted d-block">Diskon</small>
              <span className="fw-semibold text-danger">
                - Rp {Number(order.discount_amount).toLocaleString('id-ID')}
              </span>
            </div>
          )}
          {order.courier && (
            <div>
              <small className="text-muted d-block">Kurir</small>
              <span className="fw-semibold">
                <i className="bi bi-truck me-1 text-primary"></i>{order.courier}
              </span>
            </div>
          )}
          {order.tracking_number && (
            <div>
              <small className="text-muted d-block">Nomor Resi</small>
              <div className="d-flex align-items-center gap-1">
                <code className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
                  {order.tracking_number}
                </code>
                <button
                  className="btn btn-sm p-0 ms-1 text-primary"
                  title="Salin nomor resi"
                  onClick={(e) => { e.stopPropagation(); handleCopyResi(); }}
                  style={{ lineHeight: 1 }}
                >
                  <i className="bi bi-copy fs-6"></i>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tombol aksi utama */}
        <div className="d-flex gap-2 flex-wrap">
          {isPending && (
            <button
              className="btn btn-warning btn-sm fw-semibold px-3"
              onClick={(e) => { e.stopPropagation(); onPayPending(order.snap_token); }}
            >
              <i className="bi bi-credit-card me-1"></i>Bayar Sekarang
            </button>
          )}
          {isShipped && (
            <button
              className="btn btn-success btn-sm fw-semibold px-3"
              onClick={(e) => { e.stopPropagation(); onConfirmComplete(order.id); }}
            >
              <i className="bi bi-check2-circle me-1"></i>Konfirmasi Terima
            </button>
          )}
          {canCancel && (
            <button
              className="btn btn-outline-danger btn-sm fw-semibold px-3"
              onClick={(e) => { e.stopPropagation(); onRequestCancel(order); }}
            >
              <i className="bi bi-x-circle me-1"></i>Ajukan Batalkan
            </button>
          )}
          {order.cancellation_status === 'requested' && (
            <span className="badge bg-warning text-dark d-flex align-items-center px-3" style={{ borderRadius: 20, fontSize: '0.78rem' }}>
              <i className="bi bi-hourglass-split me-1"></i>Menunggu Persetujuan
            </span>
          )}
          <button
            className="btn btn-outline-secondary btn-sm px-3"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          >
            <i className={`bi bi-chevron-${expanded ? 'up' : 'down'} me-1`}></i>
            {expanded ? 'Sembunyikan' : 'Detail'}
          </button>
        </div>
      </div>

      {/* ── Detail (collapsible) ── */}
      {expanded && (
        <div className="px-4 py-4 bg-white">

          {/* Progress Stepper */}
          {!isCancelled && (
            <div className="mb-4">
              <p className="text-muted small fw-semibold mb-3 text-uppercase">Progress Pengiriman</p>
              <div className="d-flex align-items-start" style={{ overflowX: 'auto' }}>
                {STEPS.map((step, idx) => {
                  const done    = idx < active;
                  const current = idx === active;
                  const last    = idx === STEPS.length - 1;
                  return (
                    <div key={step.key} className="d-flex align-items-start flex-grow-1" style={{ minWidth: 80 }}>
                      <div className="d-flex flex-column align-items-center text-center" style={{ flex: 1 }}>
                        {/* Lingkaran */}
                        <div
                          className={`rounded-circle d-flex align-items-center justify-content-center mb-1 ${done || current ? 'bg-primary' : 'bg-light border'}`}
                          style={{ width: 40, height: 40, flexShrink: 0, transition: 'all 0.3s' }}
                        >
                          <i className={`bi ${step.icon} ${done || current ? 'text-white' : 'text-muted'}`} style={{ fontSize: '1rem' }}></i>
                        </div>
                        <small className={`fw-semibold ${current ? 'text-primary' : done ? 'text-success' : 'text-muted'}`} style={{ fontSize: '0.72rem', lineHeight: 1.3 }}>
                          {step.label}
                        </small>
                        {current && (
                          <small className="badge bg-primary bg-opacity-10 text-primary mt-1" style={{ fontSize: '0.65rem' }}>Saat ini</small>
                        )}
                        {done && (
                          <small className="text-success mt-1" style={{ fontSize: '0.65rem' }}>
                            <i className="bi bi-check-circle-fill"></i> Selesai
                          </small>
                        )}
                      </div>
                      {/* Garis penghubung */}
                      {!last && (
                        <div
                          className="flex-grow-1 mx-1"
                          style={{
                            height: 3,
                            marginTop: 19,
                            background: done ? '#0d6efd' : '#dee2e6',
                            borderRadius: 4,
                            transition: 'background 0.3s',
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Info Pengiriman */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <div className="p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e9ecef' }}>
                <p className="text-muted small fw-semibold text-uppercase mb-2">
                  <i className="bi bi-geo-alt-fill me-1 text-danger"></i>Alamat Pengiriman
                </p>
                <p className="mb-0" style={{ fontSize: '0.9rem' }}>{order.shipping_address || '-'}</p>
              </div>
            </div>

            {order.tracking_number ? (
              <div className="col-md-6">
                <div className="p-3 rounded-3" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                  <p className="text-muted small fw-semibold text-uppercase mb-2">
                    <i className="bi bi-truck me-1 text-primary"></i>Info Pengiriman
                  </p>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      {order.courier && (
                        <div className="mb-1">
                          <small className="text-muted">Kurir:</small>
                          <span className="fw-bold ms-1">{order.courier}</span>
                        </div>
                      )}
                      <div>
                        <small className="text-muted">No. Resi:</small>
                        <code className="fw-bold ms-1 text-dark">{order.tracking_number}</code>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-outline-primary" onClick={handleCopyResi}>
                      <i className="bi bi-copy me-1"></i>Salin
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-md-6">
                <div className="p-3 rounded-3 d-flex align-items-center gap-2" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                  <i className="bi bi-info-circle text-warning fs-5"></i>
                  <p className="mb-0 text-muted small">Nomor resi belum tersedia. Admin akan mengisi setelah pesanan dikemas.</p>
                </div>
              </div>
            )}
          </div>

          {/* Daftar Produk */}
          <div className="mb-4">
            <p className="text-muted small fw-semibold text-uppercase mb-2">
              <i className="bi bi-box-seam me-1 text-primary"></i>Daftar Produk
            </p>
            <div className="d-flex flex-column gap-3">
              {order.items?.map((item) => {
                const product = item.product;
                if (!product) return null;
                const primaryImage = product.images?.find((img) => img.is_primary)?.image_url || product.images?.[0]?.image_url;
                const baseImageUrl = item.selected_image_url || primaryImage;
                const imageUrl = baseImageUrl ? (baseImageUrl.startsWith("http") ? baseImageUrl : `${API_URL}${baseImageUrl}`) : "https://via.placeholder.com/60";
                const review = order.reviews?.find((r) => r.product_id === product.id);

                return (
                  <div key={item.id} className="d-flex align-items-center justify-content-between p-3 rounded-3" style={{ border: '1px solid #e9ecef', background: '#fcfcfc' }}>
                    <div className="d-flex align-items-center gap-3">
                      <img src={imageUrl} alt={product.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                      <div>
                        <div className="fw-semibold text-dark">{product.name}</div>
                        <div className="text-muted small mb-1">
                          {item.quantity} x Rp {Number(item.price_at_purchase || product.price || 0).toLocaleString('id-ID')}
                        </div>
                        {item.selected_size && (
                          <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>Ukuran: {item.selected_size}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      {order.status === 'completed' && (
                        review ? (
                          <div className="text-end">
                            <div className="text-warning mb-1" style={{ fontSize: '0.85rem' }}>
                              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </div>
                            <span className="badge bg-light text-success border border-success px-2 py-1">
                              <i className="bi bi-check2-all me-1"></i>Telah Diulas
                            </span>
                          </div>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-primary fw-semibold"
                            onClick={(e) => { e.stopPropagation(); onOpenReviewModal(order, product); }}
                          >
                            <i className="bi bi-star me-1"></i>Beri Ulasan
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Konfirmasi Terima Banner */}
          {isShipped && (
            <div className="alert alert-success d-flex align-items-center gap-3 mb-0" style={{ borderRadius: 12 }}>
              <i className="bi bi-truck fs-4 flex-shrink-0"></i>
              <div className="flex-grow-1">
                <div className="fw-semibold">Paket Anda sedang dalam perjalanan!</div>
                <small>Sudah menerima paket? Tekan konfirmasi agar pesanan ditandai selesai.</small>
              </div>
              <button
                className="btn btn-success btn-sm fw-bold px-4 flex-shrink-0"
                onClick={() => onConfirmComplete(order.id)}
              >
                <i className="bi bi-check2-circle me-1"></i>Konfirmasi Terima
              </button>
            </div>
          )}

          {/* Cancelled banner */}
          {isCancelled && (
            <div className="p-3 rounded-3" style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
              <div className="d-flex align-items-start gap-2">
                <i className="bi bi-x-circle-fill text-danger fs-5 flex-shrink-0 mt-1"></i>
                <div>
                  <div className="fw-semibold text-danger">Pesanan Dibatalkan</div>
                  {order.cancellation_reason && (
                    <div className="text-muted small mt-1">
                      <span className="fw-semibold">Alasan:</span> {order.cancellation_reason}
                    </div>
                  )}
                  {order.cancellation_note && (
                    <div className="text-muted small">
                      <span className="fw-semibold">Catatan Admin:</span> {order.cancellation_note}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Permintaan batal ditolak */}
          {order.cancellation_status === 'rejected' && order.status !== 'cancelled' && (
            <div className="alert alert-secondary d-flex align-items-start gap-2 mb-0" style={{ borderRadius: 12 }}>
              <i className="bi bi-slash-circle fs-5 flex-shrink-0"></i>
              <div>
                <div className="fw-semibold">Permintaan Pembatalan Ditolak</div>
                {order.cancellation_note && (
                  <small className="text-muted">Catatan Admin: {order.cancellation_note}</small>
                )}
              </div>
            </div>
          )}

          {/* Permintaan batal menunggu */}
          {order.cancellation_status === 'requested' && (
            <div className="alert alert-warning d-flex align-items-center gap-2 mb-0" style={{ borderRadius: 12 }}>
              <i className="bi bi-hourglass-split fs-5"></i>
              <div>
                <div className="fw-semibold">Menunggu Persetujuan Pembatalan</div>
                <small className="text-muted">Alasan: {order.cancellation_reason}</small>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Halaman Utama ─────────────────────────────────────────────────────────────
const OrdersPage = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [confirming,   setConfirming]   = useState(null);

  // State modal pembatalan
  const [cancelModal,   setCancelModal]   = useState(null); // order object
  const [cancelReason,  setCancelReason]  = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError,   setCancelError]   = useState('');

  // State modal ulasan
  const [reviewModal, setReviewModal] = useState(null); // { order, product }
  const [reviewForm, setReviewForm]   = useState({ rating: 0, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderApi.getMyOrders();
      const data = response.data || response || [];
      // Urutkan terbaru di atas
      setOrders([...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (err) {
      console.error('Gagal memuat pesanan:', err);
      setError('Ups! Gagal mengambil data riwayat pesanan.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Bayar pesanan pending
  const handlePayPending = (snapToken) => {
    if (!snapToken) { alert('Token pembayaran tidak ditemukan! Hubungi Admin.'); return; }
    window.snap.pay(snapToken, {
      onSuccess: () => { alert('Pembayaran Berhasil! 🎉'); fetchOrders(); },
      onPending: () => { alert('Menunggu pembayaran Anda...'); },
      onError:   () => { alert('Pembayaran gagal!'); },
      onClose:   () => { alert('Anda menutup jendela sebelum menyelesaikan pembayaran.'); },
    });
  };

  // Konfirmasi pesanan selesai
  const handleConfirmComplete = async (orderId) => {
    if (!window.confirm('Konfirmasi bahwa Anda sudah menerima paket ini?')) return;
    setConfirming(orderId);
    try {
      await orderApi.completeOrder(orderId);
      alert('Terima kasih! Pesanan Anda telah ditandai selesai. 🎉');
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengkonfirmasi pesanan.');
    } finally {
      setConfirming(null);
    }
  };

  // Buka modal ajukan pembatalan
  const handleOpenCancelModal = (order) => {
    setCancelModal(order);
    setCancelReason('');
    setCancelError('');
  };

  // Submit permintaan pembatalan
  const handleSubmitCancel = async (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) { setCancelError('Alasan pembatalan wajib diisi.'); return; }
    setCancelLoading(true);
    setCancelError('');
    try {
      await orderApi.requestCancellation(cancelModal.id, cancelReason.trim());
      setCancelModal(null);
      alert('Permintaan pembatalan berhasil diajukan! Tunggu persetujuan admin.');
      fetchOrders();
    } catch (err) {
      setCancelError(err.response?.data?.message || 'Gagal mengajukan pembatalan.');
    } finally {
      setCancelLoading(false);
    }
  };

  // Buka modal ulasan
  const handleOpenReviewModal = (order, product) => {
    setReviewModal({ order, product });
    setReviewForm({ rating: 0, comment: '' });
    setReviewError('');
  };

  // Submit ulasan
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      setReviewError('Silakan pilih rating bintang terlebih dahulu.');
      return;
    }
    setReviewLoading(true);
    setReviewError('');
    try {
      await reviewApi.addReview({
        order_id: reviewModal.order.id,
        product_id: reviewModal.product.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim()
      });
      alert('Terima kasih! Ulasan Anda berhasil disimpan. 🎉');
      setReviewModal(null);
      fetchOrders();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Gagal mengirim ulasan.');
    } finally {
      setReviewLoading(false);
    }
  };

  // Filter berdasarkan status
  const filtered = filterStatus
    ? orders.filter(o => o.status === filterStatus)
    : orders;

  // Hitung badge per status
  const countByStatus = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row g-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="col-12">
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 16, minHeight: 110 }}>
                <div className="placeholder-glow">
                  <span className="placeholder col-4 mb-2 d-block rounded"></span>
                  <span className="placeholder col-2 d-block rounded"></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-0">
            <i className="bi bi-bag-heart me-2 text-primary"></i>Pesanan Saya
          </h2>
          <p className="text-muted mb-0 small">Total {orders.length} pesanan</p>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={fetchOrders}>
          <i className="bi bi-arrow-clockwise me-1"></i>Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* ── Filter Tab Status ── */}
      {orders.length > 0 && (
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {[
            { value: '', label: 'Semua' },
            { value: 'pending',   label: 'Menunggu Bayar' },
            { value: 'paid',      label: 'Dibayar' },
            { value: 'shipped',   label: 'Dikirim' },
            { value: 'completed', label: 'Selesai' },
            { value: 'cancelled', label: 'Dibatalkan' },
          ].map(tab => {
            const count = tab.value ? (countByStatus[tab.value] || 0) : orders.length;
            if (tab.value && !count) return null;
            return (
              <button
                key={tab.value}
                className={`btn btn-sm px-3 ${filterStatus === tab.value ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={{ borderRadius: 20 }}
                onClick={() => setFilterStatus(tab.value)}
              >
                {tab.label}
                <span className={`badge ms-1 ${filterStatus === tab.value ? 'bg-white text-primary' : 'bg-secondary'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── List Pesanan ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-5 bg-white shadow-sm rounded-4">
          <i className="bi bi-bag-x display-4 text-muted d-block mb-3"></i>
          <h5 className="fw-bold text-muted">
            {filterStatus ? 'Tidak ada pesanan dengan status ini.' : 'Anda belum memiliki riwayat pesanan.'}
          </h5>
          {!filterStatus && (
            <Link to="/" className="btn btn-primary mt-2 px-4">
              <i className="bi bi-shop me-1"></i>Mulai Belanja
            </Link>
          )}
          {filterStatus && (
            <button className="btn btn-outline-secondary mt-2" onClick={() => setFilterStatus('')}>
              Lihat semua pesanan
            </button>
          )}
        </div>
      ) : (
        filtered.map(order => (
          <div key={order.id} style={{ opacity: confirming === order.id ? 0.6 : 1, transition: 'opacity 0.3s' }}>
            <OrderCard
              order={order}
              onPayPending={handlePayPending}
              onConfirmComplete={handleConfirmComplete}
              onRequestCancel={handleOpenCancelModal}
              onOpenReviewModal={handleOpenReviewModal}
            />
          </div>
        ))
      )}

      {/* ── MODAL PERMINTAAN PEMBATALAN ── */}
      {cancelModal && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1050 }}
            onClick={() => setCancelModal(null)}
          />
          <div className="modal d-block fade show" tabIndex="-1" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: 16, overflow: 'hidden' }}>
                {/* Header */}
                <div className="modal-header" style={{ background: 'linear-gradient(135deg,#dc3545,#ff6b6b)', color: '#fff' }}>
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-x-circle me-2"></i>Ajukan Pembatalan Pesanan
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setCancelModal(null)}></button>
                </div>
                <form onSubmit={handleSubmitCancel}>
                  <div className="modal-body p-4">
                    {/* Info pesanan */}
                    <div className="p-3 mb-4 rounded-3" style={{ background: '#fff5f5', border: '1px solid #fecaca' }}>
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-receipt text-danger fs-4"></i>
                        <div>
                          <div className="fw-bold">Pesanan #ORD-{cancelModal.id}</div>
                          <div className="text-muted small">
                            Total: <strong>Rp {Number(cancelModal.total_amount || 0).toLocaleString('id-ID')}</strong>
                            {' · '}
                            Status: <strong>{STATUS_CONFIG[cancelModal.status]?.label}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Alert info */}
                    <div className="alert alert-warning d-flex gap-2 align-items-start py-2 mb-4" style={{ borderRadius: 10 }}>
                      <i className="bi bi-exclamation-triangle-fill mt-1 flex-shrink-0"></i>
                      <small>
                        Permintaan pembatalan akan dikirim ke admin untuk ditinjau.
                        Admin akan memutuskan apakah pembatalan disetujui atau ditolak.
                        {cancelModal.status === 'paid' && ' Jika disetujui, stok produk akan dikembalikan.'}
                      </small>
                    </div>

                    {/* Alasan pembatalan */}
                    <div className="mb-1">
                      <label className="form-label fw-semibold">
                        Alasan Pembatalan <span className="text-danger">*</span>
                      </label>
                      <div className="d-flex flex-column gap-2 mb-2">
                        {[
                          'Saya ingin mengubah pesanan',
                          'Saya menemukan harga lebih murah',
                          'Produk tidak sesuai harapan',
                          'Terjadi kesalahan saat memesan',
                          'Lainnya',
                        ].map(opt => (
                          <div key={opt} className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              id={`reason-${opt}`}
                              name="cancelReason"
                              value={opt}
                              checked={cancelReason === opt}
                              onChange={e => setCancelReason(e.target.value)}
                            />
                            <label className="form-check-label" htmlFor={`reason-${opt}`}>{opt}</label>
                          </div>
                        ))}
                      </div>
                      {cancelReason === 'Lainnya' && (
                        <textarea
                          className="form-control mt-2"
                          rows={3}
                          placeholder="Tuliskan alasan Anda..."
                          onChange={e => setCancelReason(e.target.value === 'Lainnya' ? '' : e.target.value)}
                        />
                      )}
                      {cancelError && <div className="text-danger small mt-1">{cancelError}</div>}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setCancelModal(null)}>Tutup</button>
                    <button type="submit" className="btn btn-danger fw-semibold px-4" disabled={cancelLoading}>
                      {cancelLoading
                        ? <><span className="spinner-border spinner-border-sm me-2"></span>Mengajukan...</>
                        : <><i className="bi bi-send me-1"></i>Ajukan Pembatalan</>
                      }
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── MODAL BERI ULASAN ── */}
      {reviewModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} onClick={() => setReviewModal(null)} />
          <div className="modal d-block fade show" tabIndex="-1" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: 16, overflow: 'hidden' }}>
                <div className="modal-header bg-white border-bottom-0 pb-0">
                  <button type="button" className="btn-close" onClick={() => setReviewModal(null)}></button>
                </div>
                <form onSubmit={handleSubmitReview}>
                  <div className="modal-body p-4 text-center">
                    <h5 className="fw-bold mb-1">Beri Nilai Produk</h5>
                    <p className="text-muted small mb-4">Bagaimana kepuasan Anda terhadap produk ini?</p>

                    <div className="d-inline-flex align-items-center gap-3 p-3 rounded-4 mb-4" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
                      <img
                        src={reviewModal.product.images?.find((img) => img.is_primary)?.image_url ? (reviewModal.product.images?.find((img) => img.is_primary)?.image_url.startsWith("http") ? reviewModal.product.images?.find((img) => img.is_primary)?.image_url : `${API_URL}${reviewModal.product.images?.find((img) => img.is_primary)?.image_url}`) : "https://via.placeholder.com/50"}
                        alt={reviewModal.product.name}
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
                      />
                      <div className="text-start">
                        <div className="fw-semibold text-dark" style={{ lineHeight: 1.2 }}>{reviewModal.product.name}</div>
                        <small className="text-muted">Pesanan #ORD-{reviewModal.order.id}</small>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="d-flex justify-content-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <i
                            key={star}
                            className={`bi ${star <= reviewForm.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'} fs-2`}
                            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          ></i>
                        ))}
                      </div>
                      <div className="text-muted small">{reviewForm.rating > 0 ? `${reviewForm.rating} dari 5 Bintang` : 'Pilih rating bintang'}</div>
                    </div>

                    <div className="text-start mb-2">
                      <label className="form-label fw-semibold small">Komentar & Ulasan (Opsional)</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Bagaimana kualitas produk ini? Apakah sesuai deskripsi?"
                        value={reviewForm.comment}
                        onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        style={{ resize: 'none' }}
                      />
                    </div>
                    {reviewError && <div className="text-danger small text-start mb-2"><i className="bi bi-exclamation-circle me-1"></i>{reviewError}</div>}
                  </div>
                  <div className="modal-footer border-top-0 pt-0 px-4 pb-4">
                    <button type="submit" className="btn btn-primary w-100 fw-semibold rounded-pill py-2" disabled={reviewLoading}>
                      {reviewLoading ? <><span className="spinner-border spinner-border-sm me-2"></span>Mengirim...</> : 'Kirim Ulasan'}
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

export default OrdersPage;
