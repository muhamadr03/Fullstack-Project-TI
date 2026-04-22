import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil data pesanan saat halaman pertama kali dibuka
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getMyOrders();
      // Antisipasi perbedaan format response dari Backend
      setOrders(response.data || response || []);
    } catch (err) {
      console.error("Gagal memuat pesanan:", err);
      setError("Ups! Gagal mengambil data riwayat pesanan.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk memanggil ulang Midtrans jika status masih "pending"
  const handlePayPending = (snapToken) => {
    if (!snapToken) {
      alert("Token pembayaran tidak ditemukan! Hubungi Admin.");
      return;
    }

    window.snap.pay(snapToken, {
      onSuccess: function (result) {
        alert("Pembayaran Berhasil! 🎉");
        fetchOrders(); // Refresh tabel agar status berubah jadi Paid
      },
      onPending: function (result) {
        alert("Menunggu pembayaran Anda...");
      },
      onError: function (result) {
        alert("Pembayaran gagal!");
      },
      onClose: function () {
        alert("Anda menutup jendela sebelum menyelesaikan pembayaran.");
      }
    });
  };

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
      <h2 className="fw-bold mb-4">Riwayat Pesanan Saya</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {orders.length === 0 ? (
        <div className="text-center py-5 bg-white shadow-sm rounded">
          <h5 className="text-muted mb-3">Anda belum memiliki riwayat pesanan.</h5>
          <Link to="/" className="btn btn-primary">Mulai Belanja Sekarang</Link>
        </div>
      ) : (
        <div className="table-responsive bg-white p-3 shadow-sm rounded">
          <table className="table align-middle table-hover">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Tanggal</th>
                <th>Alamat Pengiriman</th>
                <th>Total Tagihan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="fw-bold text-primary">#ORD-{order.id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                  <td>
                    <span className="d-inline-block text-truncate" style={{ maxWidth: '200px' }}>
                      {order.shipping_address}
                    </span>
                  </td>
                  <td className="fw-bold">
                    Rp {order.total_amount ? order.total_amount.toLocaleString('id-ID') : 0}
                  </td>
                  <td>
                    {order.status === 'paid' && <span className="badge bg-success">Lunas</span>}
                    {order.status === 'pending' && <span className="badge bg-warning text-dark">Menunggu Pembayaran</span>}
                    {order.status === 'cancelled' && <span className="badge bg-danger">Dibatalkan</span>}
                  </td>
                  <td>
                    {/* Jika pending, tampilkan tombol bayar. Jika lunas, tampilkan tombol detail/selesai */}
                    {order.status === 'pending' ? (
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handlePayPending(order.snap_token)}
                      >
                        Bayar Sekarang
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-outline-secondary" disabled>
                        Selesai
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
