import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { orderApi } from "../../api/orderApi";
import { couponApi } from "../../api/couponApi";

const CheckoutPage = () => {
  const { cartItems, cartLoading } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const selectedItems = location.state?.selectedItems || [];

  // Filter hanya item yang dipilih
  const checkoutItems = cartItems.filter(item => selectedItems.includes(item.id));

  // Hitung total harga lokal untuk item yang dipilih
  const localTotalPrice = checkoutItems.reduce((sum, item) => {
    const productData = item.Product || item.product || {};
    const price = item.variant?.price || productData.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const [address, setAddress] = useState({
    street: "",
    city: "Jakarta Selatan",
    postal_code: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // State Kupon
  const [couponInput, setCouponInput] = useState("");
  const [couponStatus, setCouponStatus] = useState(null); // null | "loading" | "valid" | "invalid"
  const [appliedCoupon, setAppliedCoupon] = useState(null); // objek kupon dari backend

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponStatus("loading");
    setAppliedCoupon(null);
    try {
      const res = await couponApi.validateCoupon(couponInput.trim().toUpperCase());
      if (res?.success) {
        setAppliedCoupon(res.data);
        setCouponStatus("valid");
      } else {
        setCouponStatus("invalid");
      }
    } catch (err) {
      setCouponStatus("invalid");
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponInput("");
    setAppliedCoupon(null);
    setCouponStatus(null);
  };

  // Hitung diskon berdasarkan field DB: discount_percentage, max_discount
  const discountAmount = appliedCoupon
    ? Math.min(
        Math.floor((localTotalPrice * Number(appliedCoupon.discount_percentage)) / 100),
        appliedCoupon.max_discount ? Number(appliedCoupon.max_discount) : Infinity
      )
    : 0;
  const finalTotal = localTotalPrice - discountAmount;

  const handlePay = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const fullAddress = `${address.street}, ${address.city}, ${address.postal_code}`;
      const response = await orderApi.createOrder(fullAddress, appliedCoupon?.code || null, selectedItems);
      const snapToken = response.data?.snap_token;
      const orderId = response.data?.order_id;

      if (!snapToken) throw new Error("Token pembayaran gagal dibuat oleh server.");

      window.snap.pay(snapToken, {
        onSuccess: async () => {
          try {
            // Verifikasi pembayaran langsung ke Midtrans via backend
            await orderApi.verifyPayment(orderId);
          } catch (err) {
            console.warn("Verify payment error (diabaikan):", err.message);
          }
          navigate("/orders");
        },
        onPending: () => { alert("Menunggu pembayaran Anda..."); navigate("/orders"); },
        onError: () => { alert("Pembayaran gagal!"); setIsProcessing(false); },
        onClose: () => { alert("Anda menutup jendela sebelum menyelesaikan pembayaran."); setIsProcessing(false); },
      });
    } catch (error) {
      console.error("Gagal Checkout:", error);
      alert(error.response?.data?.message || "Terjadi kesalahan saat checkout.");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // Jika tidak ada item yang dipilih dan selesai loading, lempar kembali ke cart
    if (!cartLoading && checkoutItems.length === 0) {
      navigate("/cart");
    }
  }, [cartLoading, checkoutItems.length, navigate]);

  if (cartLoading || checkoutItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Mempersiapkan checkout...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-bag-check me-2 text-primary"></i>Checkout
      </h2>

      <div className="row g-4">
        {/* KIRI: Form Alamat */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm p-4 mb-4">
            <h5 className="fw-bold mb-4">
              <i className="bi bi-geo-alt-fill text-primary me-2"></i>Alamat Pengiriman
            </h5>
            <form onSubmit={handlePay}>
              <div className="mb-3">
                <label className="form-label fw-medium">Jalan / Detail Rumah</label>
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
              <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label fw-medium">Kota / Kabupaten</label>
                  <input type="text" className="form-control" name="city" required value={address.city} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">Kode Pos</label>
                  <input type="text" className="form-control" name="postal_code" required value={address.postal_code} onChange={handleChange} />
                </div>
              </div>

              {/* Info jasa kirim diatur oleh admin */}
              <div className="alert alert-info d-flex align-items-center gap-2 mb-4 py-2" role="alert">
                <i className="bi bi-info-circle-fill fs-5"></i>
                <small>Jasa pengiriman & ongkos kirim akan ditentukan oleh Admin setelah pesanan Anda diproses.</small>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-3 fw-bold fs-5"
                disabled={isProcessing}
              >
                {isProcessing
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Memproses...</>
                  : <><i className="bi bi-shield-lock me-2"></i>Bayar Sekarang</>
                }
              </button>
            </form>
          </div>
        </div>

        {/* KANAN: Ringkasan Pesanan + Kupon */}
        <div className="col-lg-5">
          {/* Form Kupon */}
          <div className="card border-0 shadow-sm p-4 mb-4">
            <h6 className="fw-bold mb-3">
              <i className="bi bi-ticket-perforated-fill text-warning me-2"></i>Kode Kupon
            </h6>
            {appliedCoupon ? (
              <div className="alert alert-success d-flex justify-content-between align-items-center py-2 mb-0">
                <div>
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <strong>{appliedCoupon.code}</strong>
                  {" — Diskon "}
                  <strong>{appliedCoupon.discount_percentage}%</strong>
                  {appliedCoupon.max_discount && (
                    <span className="text-muted ms-1" style={{ fontSize: "0.8rem" }}>
                      (maks. Rp {Number(appliedCoupon.max_discount).toLocaleString("id-ID")})
                    </span>
                  )}
                </div>
                <button className="btn btn-sm btn-link text-danger p-0" onClick={handleRemoveCoupon}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            ) : (
              <div className="input-group">
                <input
                  type="text"
                  className={`form-control ${couponStatus === "invalid" ? "is-invalid" : ""}`}
                  placeholder="Masukkan kode kupon..."
                  value={couponInput}
                  onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponStatus(null); }}
                />
                <button
                  className="btn btn-warning fw-bold"
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponStatus === "loading" || !couponInput.trim()}
                >
                  {couponStatus === "loading" ? <span className="spinner-border spinner-border-sm"></span> : "Pakai"}
                </button>
                {couponStatus === "invalid" && (
                  <div className="invalid-feedback">Kupon tidak valid atau sudah kedaluwarsa.</div>
                )}
              </div>
            )}
          </div>

          {/* Ringkasan Belanja */}
          <div className="card border-0 shadow-sm p-4">
            <h6 className="fw-bold mb-3">
              <i className="bi bi-receipt me-2 text-primary"></i>Ringkasan Pesanan
            </h6>
            <ul className="list-group list-group-flush mb-3">
              {checkoutItems.map((item) => {
                const productData = item.Product || item.product || {};
                return (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-start px-0 py-2">
                    <div>
                      <div className="d-flex align-items-center mb-1">
                        {item.selected_image_url && (
                          <img
                            src={item.selected_image_url}
                            alt="Variant"
                            style={{ width: "30px", height: "30px", objectFit: "cover", borderRadius: "4px", marginRight: "8px" }}
                          />
                        )}
                        <p className="mb-0 fw-medium" style={{ fontSize: "0.875rem" }}>{productData.name}</p>
                      </div>
                      <div className="d-flex gap-2 align-items-center">
                        <small className="text-muted">x{item.quantity}</small>
                        {item.selected_size && (
                          <span className="badge bg-info text-dark" style={{ fontSize: "0.65rem" }}>
                            Varian: {item.selected_size}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-muted fw-medium" style={{ fontSize: "0.875rem" }}>
                      Rp {((item.variant?.price || productData.price || 0) * item.quantity).toLocaleString("id-ID")}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="border-top pt-3">
              <div className="d-flex justify-content-between mb-2 text-muted">
                <span>Subtotal</span>
                <span>Rp {localTotalPrice.toLocaleString("id-ID")}</span>
              </div>
              {discountAmount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success fw-medium">
                  <span><i className="bi bi-tag-fill me-1"></i>Diskon Kupon</span>
                  <span>- Rp {discountAmount.toLocaleString("id-ID")}</span>
                </div>
              )}
              <div className="d-flex justify-content-between mb-2 text-muted">
                <span><i className="bi bi-truck me-1"></i>Ongkir</span>
                <span className="text-secondary fst-italic" style={{ fontSize: "0.85rem" }}>Ditentukan Admin</span>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5 text-primary mt-2 border-top pt-2">
                <span>Total Bayar</span>
                <span>Rp {finalTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;