import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { orderApi } from "../../api/orderApi";

const CheckoutPage = () => {
  const { cartItems, totalPrice, cartLoading } = useContext(CartContext);
  const navigate = useNavigate();

  // State untuk form alamat (Bisa dikembangkan nanti mengambil dari tabel Address)
  const [address, setAddress] = useState({
    street: "",
    city: "Jakarta Selatan", // Default kota
    postal_code: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Format alamat menjadi satu string (sesuaikan dengan ekspektasi backend)
      const fullAddress = `${address.street}, ${address.city}, ${address.postal_code}`;

      // 2. Tembak Backend untuk buat Order dan dapatkan Snap Token
      const response = await orderApi.createOrder(fullAddress);

      const snapToken = response.data?.snap_token;

      if (!snapToken) {
        throw new Error("Token pembayaran gagal dibuat oleh server.");
      }

      // 3. Panggil Popup Midtrans
      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          alert("Pembayaran Berhasil! 🎉");
          navigate("/orders"); // Arahkan ke halaman pesanan
        },
        onPending: function (result) {
          alert("Menunggu pembayaran Anda...");
          navigate("/orders");
        },
        onError: function (result) {
          alert("Pembayaran gagal!");
          setIsProcessing(false);
        },
        onClose: function () {
          alert("Anda menutup jendela sebelum menyelesaikan pembayaran.");
          setIsProcessing(false);
        },
      });
    } catch (error) {
      console.error("Gagal Checkout:", error);
      alert(
        error.response?.data?.message || "Terjadi kesalahan saat checkout.",
      );
      setIsProcessing(false);
    }
  };

  // Guard jika cart kosong
  if (!cartLoading && cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h4>Keranjang Anda kosong!</h4>
        <button onClick={() => navigate("/")} className="btn btn-primary mt-3">
          Kembali Belanja
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Pengiriman & Pembayaran</h2>

      <div className="row">
        {/* Form Alamat */}
        <div className="col-md-7 mb-4">
          <div className="card shadow-sm border-0 p-4">
            <h5 className="mb-3">Alamat Pengiriman</h5>
            <form onSubmit={handlePay}>
              <div className="mb-3">
                <label className="form-label">Jalan / Detail Rumah</label>
                <textarea
                  className="form-control"
                  name="street"
                  rows="2"
                  required
                  placeholder="Jl. Mawar No. 12, RT 01/02..."
                  value={address.street}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Kota / Kabupaten</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    required
                    value={address.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Kode Pos</label>
                  <input
                    type="text"
                    className="form-control"
                    name="postal_code"
                    required
                    value={address.postal_code}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-bold"
                disabled={isProcessing}
              >
                {isProcessing ? "Memproses..." : "Bayar Sekarang"}
              </button>
            </form>
          </div>
        </div>

        {/* Ringkasan Belanja Mini */}
        <div className="col-md-5">
          <div className="card shadow-sm border-0 p-4">
            <h5 className="mb-3">Pesanan Anda</h5>
            <ul className="list-group list-group-flush mb-3">
              {cartItems.map((item) => {
                const productData = item.Product || item.product || {};
                return (
                  <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between lh-sm px-0"
                  >
                    <div>
                      <h6 className="my-0">{productData.name}</h6>
                      <small className="text-muted">
                        Jumlah: {item.quantity}
                      </small>
                    </div>
                    <span className="text-muted">
                      Rp{" "}
                      {productData.price
                        ? (productData.price * item.quantity).toLocaleString(
                            "id-ID",
                          )
                        : 0}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="d-flex justify-content-between fw-bold fs-5 text-danger border-top pt-3">
              <span>Total</span>
              <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;