import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productApi } from "../../api/productApi";
import { reviewApi } from "../../api/reviewApi";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

// =========================================================
// Komponen Bintang Interaktif
// =========================================================
const StarRating = ({ rating, onRate, readOnly = false, size = "1.5rem" }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: "4px", cursor: readOnly ? "default" : "pointer" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: size,
            color: (hovered || rating) >= star ? "#f59e0b" : "#d1d5db",
            transition: "color 0.15s ease, transform 0.15s ease",
            transform: !readOnly && (hovered || rating) >= star ? "scale(1.2)" : "scale(1)",
            display: "inline-block",
          }}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          onClick={() => !readOnly && onRate && onRate(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

// =========================================================
// Komponen Kartu Ulasan
// =========================================================
const ReviewCard = ({ review }) => {
  const initials = review.user?.name
    ? review.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AN";

  const avatarColor = [
    "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6",
  ][review.user_id % 6];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "14px",
        padding: "1.25rem 1.5rem",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        marginBottom: "1rem",
        transition: "box-shadow 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
        {/* Avatar */}
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: avatarColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "700",
            fontSize: "0.9rem",
            flexShrink: 0,
            letterSpacing: "0.5px",
          }}
        >
          {initials}
        </div>

        {/* Konten */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <div>
              <span style={{ fontWeight: "600", color: "#1e293b", fontSize: "0.95rem" }}>
                {review.user?.name || "Anonymous"}
              </span>
              <span style={{ marginLeft: "0.75rem", color: "#94a3b8", fontSize: "0.8rem" }}>
                {new Date(review.created_at).toLocaleDateString("id-ID", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </span>
            </div>
            <StarRating rating={review.rating} readOnly size="1.1rem" />
          </div>

          {review.comment && (
            <p style={{ margin: 0, color: "#475569", fontSize: "0.92rem", lineHeight: "1.6", whiteSpace: "pre-line" }}>
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// =========================================================
// Komponen Ringkasan Rating
// =========================================================
const RatingSummary = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: Math.round((reviews.filter((r) => r.rating === star).length / reviews.length) * 100),
  }));

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
        border: "1px solid #e0e7ff",
        borderRadius: "16px",
        padding: "1.5rem",
        display: "flex",
        gap: "2rem",
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: "1.5rem",
      }}
    >
      {/* Angka Rata-rata */}
      <div style={{ textAlign: "center", minWidth: "100px" }}>
        <div style={{ fontSize: "3.5rem", fontWeight: "800", color: "#4f46e5", lineHeight: 1 }}>
          {avg.toFixed(1)}
        </div>
        <StarRating rating={Math.round(avg)} readOnly size="1.3rem" />
        <div style={{ color: "#94a3b8", fontSize: "0.8rem", marginTop: "0.3rem" }}>
          {reviews.length} ulasan
        </div>
      </div>

      {/* Bar Chart Per Bintang */}
      <div style={{ flex: 1, minWidth: "200px" }}>
        {counts.map(({ star, count, pct }) => (
          <div key={star} style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#64748b", width: "40px", flexShrink: 0 }}>
              {star} ★
            </span>
            <div style={{ flex: 1, height: "8px", background: "#e2e8f0", borderRadius: "99px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
                  borderRadius: "99px",
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            <span style={{ fontSize: "0.8rem", color: "#94a3b8", width: "28px", textAlign: "right" }}>
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// =========================================================
// Halaman Utama
// =========================================================
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  // State untuk section review
  const [reviews, setReviews] = useState([]);
  const [eligibleOrders, setEligibleOrders] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    order_id: "",
    rating: 0,
    comment: "",
  });
  const [reviewMsg, setReviewMsg] = useState({ type: "", text: "" });
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Cek login status (baca dari localStorage langsung agar tidak perlu ubah AuthContext)
  const isLoggedIn = !!localStorage.getItem("token");

  // Ambil detail produk
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await productApi.getProductById(id);
        setProduct(response);
      } catch (err) {
        setError("Ups! Produk tidak ditemukan atau terjadi kesalahan server.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [id]);

  // Ambil ulasan produk
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewLoading(true);
        const data = await reviewApi.getProductReviews(id);
        setReviews(data);
      } catch {
        // Abaikan jika gagal load review
      } finally {
        setReviewLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  // Ambil eligible orders jika user sudah login
  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchEligibleOrders = async () => {
      try {
        const response = await import("../../api/axiosInstance").then((m) =>
          m.default.get(`/reviews/eligible-orders?product_id=${id}`)
        );
        setEligibleOrders(response.data || []);
      } catch {
        // User belum punya pesanan yang eligible
      }
    };
    fetchEligibleOrders();
  }, [id, isLoggedIn]);

  const handleAddToCart = async () => {
    const result = await addToCart(product.id, quantity);
    if (result.success) {
      alert(`Berhasil! ${quantity} buah ${product.name} masuk ke keranjang 🛒`);
    } else {
      alert(`Ups, gagal memasukkan ke keranjang: ${result.message}`);
      if (
        result.message.toLowerCase().includes("token") ||
        result.message.toLowerCase().includes("login")
      ) {
        navigate("/login");
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating) {
      setReviewMsg({ type: "error", text: "Silakan pilih rating bintang terlebih dahulu." });
      return;
    }
    if (!reviewForm.order_id) {
      setReviewMsg({ type: "error", text: "Silakan pilih pesanan yang ingin diulas." });
      return;
    }
    try {
      setSubmitLoading(true);
      await reviewApi.addReview({
        product_id: parseInt(id),
        order_id: parseInt(reviewForm.order_id),
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviewMsg({ type: "success", text: "Terima kasih! Ulasan Anda berhasil dikirim. 🎉" });
      setReviewForm({ order_id: "", rating: 0, comment: "" });
      // Refresh ulasan & eligible orders
      const data = await reviewApi.getProductReviews(id);
      setReviews(data);
      // Refresh eligible orders
      const resp = await import("../../api/axiosInstance").then((m) =>
        m.default.get(`/reviews/eligible-orders?product_id=${id}`)
      );
      setEligibleOrders(resp.data || []);
    } catch (err) {
      const msg = err?.response?.data?.message || "Gagal mengirim ulasan.";
      setReviewMsg({ type: "error", text: msg });
    } finally {
      setSubmitLoading(false);
    }
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

  if (error || !product) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error || "Produk tidak ditemukan"}</div>
        <Link to="/" className="btn btn-outline-primary">Kembali ke Beranda</Link>
      </div>
    );
  }

  const backendUrl = "http://localhost:5000";
  const imageUrl = product.image_url
    ? (product.image_url.startsWith('http') ? product.image_url : `${backendUrl}${product.image_url}`)
    : "https://via.placeholder.com/500x500?text=No+Image";

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 4);

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      {/* Detail Produk */}
      <div className="row bg-white p-4 rounded shadow-sm mb-5">
        <div className="col-md-5 mb-4 mb-md-0 text-center">
          <img
            src={imageUrl}
            alt={product.name}
            className="img-fluid rounded"
            style={{ maxHeight: "400px", objectFit: "cover" }}
            onError={(e) => { e.target.src = "https://via.placeholder.com/500x500?text=Image+Not+Found"; }}
          />
        </div>

        <div className="col-md-7 d-flex flex-column justify-content-center">
          {product.category && (
            <span className="badge bg-secondary mb-2" style={{ width: "fit-content" }}>
              {product.category.name}
            </span>
          )}

          <h2 className="fw-bold mb-2">{product.name}</h2>

          {/* Mini rating summary di atas harga */}
          {reviews.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <StarRating
                rating={Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)}
                readOnly
                size="1rem"
              />
              <span style={{ color: "#f59e0b", fontWeight: "600", fontSize: "0.9rem" }}>
                {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
              </span>
              <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                ({reviews.length} ulasan)
              </span>
            </div>
          )}

          <h3 className="text-danger fw-bold mb-4">
            Rp {product.price.toLocaleString("id-ID")}
          </h3>

          <div className="mb-4">
            <h6 className="fw-bold">Deskripsi Produk:</h6>
            <p className="text-muted" style={{ whiteSpace: "pre-line" }}>{product.description}</p>
          </div>

          <div className="mb-4">
            <h6 className="fw-bold">
              Sisa Stok: <span className="text-primary">{product.stock}</span>
            </h6>
          </div>

          {product.stock > 0 ? (
            <div className="d-flex align-items-center gap-3 mt-auto">
              <div className="input-group" style={{ width: "130px" }}>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >-</button>
                <input type="text" className="form-control text-center" value={quantity} readOnly />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                  disabled={quantity >= product.stock}
                >+</button>
              </div>
              <button className="btn btn-primary px-4 py-2" onClick={handleAddToCart}>
                <i className="bi bi-cart-plus me-2"></i> Masukkan Keranjang
              </button>
            </div>
          ) : (
            <div className="alert alert-warning mt-auto" role="alert">
              Maaf, stok produk ini sedang kosong.
            </div>
          )}
        </div>
      </div>

      {/* =============================================
          SECTION ULASAN & RATING
      ============================================= */}
      <div
        style={{
          background: "#f8fafc",
          borderRadius: "20px",
          padding: "2rem",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* Header Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}
          >
            💬
          </div>
          <div>
            <h4 style={{ margin: 0, fontWeight: "700", color: "#1e293b" }}>
              Ulasan Pelanggan
            </h4>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.85rem" }}>
              {reviews.length > 0
                ? `${reviews.length} ulasan dari pembeli yang sudah verifikasi`
                : "Belum ada ulasan untuk produk ini"}
            </p>
          </div>
        </div>

        {/* Rating Summary */}
        {!reviewLoading && reviews.length > 0 && <RatingSummary reviews={reviews} />}

        {/* Form Kirim Ulasan */}
        {isLoggedIn ? (
          eligibleOrders.length > 0 ? (
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "1.5rem",
                border: "1px solid #e0e7ff",
                marginBottom: "1.5rem",
                boxShadow: "0 4px 16px rgba(79,70,229,0.06)",
              }}
            >
              <h5 style={{ fontWeight: "700", color: "#4f46e5", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.2rem" }}>✍️</span> Tulis Ulasan Anda
              </h5>

              {reviewMsg.text && (
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "10px",
                    marginBottom: "1rem",
                    background: reviewMsg.type === "success" ? "#dcfce7" : "#fee2e2",
                    color: reviewMsg.type === "success" ? "#166534" : "#991b1b",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                  }}
                >
                  {reviewMsg.text}
                </div>
              )}

              <form onSubmit={handleSubmitReview}>
                {/* Pilih Pesanan */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "0.4rem", fontSize: "0.9rem" }}>
                    Pilih Pesanan
                  </label>
                  <select
                    id="select-order-review"
                    className="form-select"
                    value={reviewForm.order_id}
                    onChange={(e) => setReviewForm((prev) => ({ ...prev, order_id: e.target.value }))}
                    required
                    style={{ borderRadius: "10px", border: "1.5px solid #e2e8f0" }}
                  >
                    <option value="">-- Pilih pesanan --</option>
                    {eligibleOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        #ORD-{order.id} — {new Date(order.created_at).toLocaleDateString("id-ID")}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating Bintang */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                    Rating
                  </label>
                  <StarRating
                    rating={reviewForm.rating}
                    onRate={(star) => setReviewForm((prev) => ({ ...prev, rating: star }))}
                    size="2rem"
                  />
                  {reviewForm.rating > 0 && (
                    <span style={{ marginLeft: "0.5rem", color: "#f59e0b", fontWeight: "600", fontSize: "0.9rem" }}>
                      {["", "Sangat Buruk", "Buruk", "Cukup", "Bagus", "Sangat Bagus"][reviewForm.rating]}
                    </span>
                  )}
                </div>

                {/* Komentar */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "0.4rem", fontSize: "0.9rem" }}>
                    Komentar <span style={{ color: "#94a3b8", fontWeight: "400" }}>(opsional)</span>
                  </label>
                  <textarea
                    id="review-comment"
                    className="form-control"
                    rows={4}
                    placeholder="Ceritakan pengalaman Anda dengan produk ini..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                    style={{ borderRadius: "10px", border: "1.5px solid #e2e8f0", resize: "vertical" }}
                  />
                </div>

                <button
                  id="submit-review-btn"
                  type="submit"
                  disabled={submitLoading}
                  style={{
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.65rem 1.75rem",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    cursor: submitLoading ? "not-allowed" : "pointer",
                    opacity: submitLoading ? 0.7 : 1,
                    transition: "opacity 0.2s, transform 0.2s",
                  }}
                >
                  {submitLoading ? "Mengirim..." : "Kirim Ulasan"}
                </button>
              </form>
            </div>
          ) : (
            // User login tapi belum punya eligible order
            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "12px",
                padding: "1rem 1.25rem",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#92400e",
                fontSize: "0.9rem",
              }}
            >
              <span style={{ fontSize: "1.3rem" }}>ℹ️</span>
              <span>
                Ulasan hanya dapat diberikan setelah Anda membeli dan membayar produk ini.{" "}
                <Link to="/" style={{ color: "#4f46e5", fontWeight: "600" }}>
                  Belanja sekarang →
                </Link>
              </span>
            </div>
          )
        ) : (
          // User belum login
          <div
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              color: "#1e40af",
              fontSize: "0.9rem",
            }}
          >
            <span style={{ fontSize: "1.3rem" }}>🔒</span>
            <span>
              <Link to="/login" style={{ color: "#4f46e5", fontWeight: "700" }}>Login</Link> atau{" "}
              <Link to="/register" style={{ color: "#4f46e5", fontWeight: "700" }}>Daftar</Link>{" "}
              untuk memberikan ulasan pada produk ini.
            </span>
          </div>
        )}

        {/* Daftar Ulasan */}
        {reviewLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border spinner-border-sm text-primary" role="status" />
            <span className="ms-2 text-muted">Memuat ulasan...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              color: "#94a3b8",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>💤</div>
            <p style={{ fontWeight: "500", margin: 0 }}>
              Belum ada ulasan. Jadilah yang pertama mengulas!
            </p>
          </div>
        ) : (
          <>
            {displayedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}

            {reviews.length > 4 && (
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <button
                  onClick={() => setShowAllReviews((prev) => !prev)}
                  style={{
                    background: "transparent",
                    border: "1.5px solid #4f46e5",
                    color: "#4f46e5",
                    borderRadius: "10px",
                    padding: "0.5rem 1.5rem",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "background 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => { e.target.style.background = "#4f46e5"; e.target.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#4f46e5"; }}
                >
                  {showAllReviews ? "Tampilkan Lebih Sedikit ↑" : `Lihat Semua ${reviews.length} Ulasan ↓`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
