import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productApi } from "../../api/productApi";
import { reviewApi } from "../../api/reviewApi";
import { wishlistApi } from "../../api/wishlistApi";
import { CartContext } from "../../context/CartContext";

const StarRating = ({ rating, onRate, readOnly = false, size = "1.5rem" }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        cursor: readOnly ? "default" : "pointer",
        alignItems: "center",
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: size,
            color: (hovered || rating) >= star ? "#f59e0b" : "#d1d5db",
            transition: "color 0.15s ease, transform 0.15s ease",
            transform:
              !readOnly && (hovered || rating) >= star
                ? "scale(1.2)"
                : "scale(1)",
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

const ReviewCard = ({ review }) => {
  const initials = review.user?.name
    ? review.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AN";

  const avatarColor = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
  ][review.user_id % 6];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "18px",
        padding: "1.25rem 1.35rem",
        border: "1px solid #e5e7eb",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
        marginBottom: "1rem",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
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

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "0.4rem",
            }}
          >
            <div>
              <span
                style={{
                  fontWeight: "700",
                  color: "#0f172a",
                  fontSize: "0.95rem",
                }}
              >
                {review.user?.name || "Anonymous"}
              </span>
              <span
                style={{
                  marginLeft: "0.75rem",
                  color: "#94a3b8",
                  fontSize: "0.8rem",
                }}
              >
                {new Date(review.created_at).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <StarRating rating={review.rating} readOnly size="1.1rem" />
          </div>

          {review.comment && (
            <p
              style={{
                margin: 0,
                color: "#475569",
                fontSize: "0.92rem",
                lineHeight: "1.7",
                whiteSpace: "pre-line",
              }}
            >
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const RatingSummary = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: Math.round(
      (reviews.filter((r) => r.rating === star).length / reviews.length) * 100,
    ),
  }));

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(14,165,233,0.05) 100%)",
        border: "1px solid rgba(99,102,241,0.15)",
        borderRadius: "20px",
        padding: "1.5rem",
        display: "flex",
        gap: "2rem",
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: "1.5rem",
      }}
    >
      <div style={{ textAlign: "center", minWidth: "100px" }}>
        <div
          style={{
            fontSize: "3.4rem",
            fontWeight: "800",
            color: "#4f46e5",
            lineHeight: 1,
          }}
        >
          {avg.toFixed(1)}
        </div>
        <StarRating rating={Math.round(avg)} readOnly size="1.3rem" />
        <div
          style={{ color: "#94a3b8", fontSize: "0.8rem", marginTop: "0.3rem" }}
        >
          {reviews.length} ulasan
        </div>
      </div>

      <div style={{ flex: 1, minWidth: "200px" }}>
        {counts.map(({ star, count, pct }) => (
          <div
            key={star}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "0.4rem",
            }}
          >
            <span
              style={{
                fontSize: "0.8rem",
                color: "#64748b",
                width: "40px",
                flexShrink: 0,
              }}
            >
              {star} ★
            </span>
            <div
              style={{
                flex: 1,
                height: "8px",
                background: "#e2e8f0",
                borderRadius: "99px",
                overflow: "hidden",
              }}
            >
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
            <span
              style={{
                fontSize: "0.8rem",
                color: "#94a3b8",
                width: "28px",
                textAlign: "right",
              }}
            >
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

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
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [reviewForm, setReviewForm] = useState({
    order_id: "",
    rating: 0,
    comment: "",
  });
  const [reviewMsg, setReviewMsg] = useState({ type: "", text: "" });
  const [showAllReviews, setShowAllReviews] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

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

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchEligibleOrders = async () => {
      try {
        const response = await import("../../api/axiosInstance").then((m) =>
          m.default.get(`/reviews/eligible-orders?product_id=${id}`),
        );
        setEligibleOrders(response.data || []);
      } catch {
        // User belum punya pesanan yang eligible
      }
    };
    fetchEligibleOrders();
  }, [id, isLoggedIn]);

  useEffect(() => {
    setActiveTab("description");
    setReviewMsg({ type: "", text: "" });
    setShowAllReviews(false);
  }, [id]);

  const backendUrl = "http://localhost:5000";
  const imageUrl = product?.image_url
    ? product.image_url.startsWith("http")
      ? product.image_url
      : `${backendUrl}${product.image_url}`
    : "https://via.placeholder.com/900x900?text=No+Image";

  const [activeImage, setActiveImage] = useState(imageUrl);

  useEffect(() => {
    setActiveImage(imageUrl);
  }, [imageUrl]);

  const galleryItems = [
    { label: "Main View", src: imageUrl },
    { label: "Detail", src: imageUrl },
    { label: "Lifestyle", src: imageUrl },
  ];

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const handleToggleWishlist = async () => {
    try {
      setWishlistLoading(true);
      const res = await wishlistApi.toggleWishlist(product.id);
      if (res.data?.action === "added") {
        setIsWishlisted(true);
      } else {
        setIsWishlisted(false);
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Silakan login terlebih dahulu untuk menyimpan wishlist.");
        navigate("/login");
      } else {
        console.error("Gagal toggle wishlist:", error);
      }
    } finally {
      setWishlistLoading(false);
    }
  };

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
      setReviewMsg({
        type: "error",
        text: "Silakan pilih rating bintang terlebih dahulu.",
      });
      return;
    }
    if (!reviewForm.order_id) {
      setReviewMsg({
        type: "error",
        text: "Silakan pilih pesanan yang ingin diulas.",
      });
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
      setReviewMsg({
        type: "success",
        text: "Terima kasih! Ulasan Anda berhasil dikirim. 🎉",
      });
      setReviewForm({ order_id: "", rating: 0, comment: "" });
      // Refresh ulasan & eligible orders
      const data = await reviewApi.getProductReviews(id);
      setReviews(data);
      // Refresh eligible orders
      const resp = await import("../../api/axiosInstance").then((m) =>
        m.default.get(`/reviews/eligible-orders?product_id=${id}`),
      );
      setEligibleOrders(resp.data || []);
    } catch (err) {
      const msg = err?.response?.data?.message || "Gagal mengirim ulasan.";
      setReviewMsg({ type: "error", text: msg });
    } finally {
      setSubmitLoading(false);
    }
  };

  const stockStatus =
    product?.stock > 0
      ? { label: "Tersedia", color: "#16a34a", bg: "rgba(22, 163, 74, 0.12)" }
      : { label: "Habis", color: "#dc2626", bg: "rgba(220, 38, 38, 0.12)" };

  const specificationItems = product
    ? [
        { label: "Nama Produk", value: product.name },
        { label: "Kategori", value: product.category?.name || "-" },
        {
          label: "Harga",
          value: `Rp ${product.price.toLocaleString("id-ID")}`,
        },
        { label: "Stok", value: `${product.stock} unit` },
        { label: "Status", value: stockStatus.label },
        {
          label: "Rating",
          value: reviews.length
            ? `${averageRating.toFixed(1)} / 5`
            : "Belum ada ulasan",
        },
      ]
    : [];

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          minHeight: "60vh",
          background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="mt-3 text-muted">Memuat detail produk...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          {error || "Produk tidak ditemukan"}
        </div>
        <Link to="/" className="btn btn-outline-primary">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 4);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #ffffff 20%, #f8fafc 100%)",
      }}
    >
      <div className="container py-5">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-0" style={{ fontSize: "0.92rem" }}>
            <li className="breadcrumb-item">
              <Link to="/" style={{ color: "#4f46e5", textDecoration: "none" }}>
                Home
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 18px 60px rgba(15, 23, 42, 0.08)",
            padding: "1.25rem",
          }}
        >
          <div className="row g-4 align-items-start">
            <div className="col-lg-5">
              <div style={{ position: "sticky", top: "1.25rem" }}>
                <div
                  style={{
                    borderRadius: "24px",
                    overflow: "hidden",
                    background:
                      "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
                    border: "1px solid rgba(99,102,241,0.08)",
                    boxShadow: "0 16px 36px rgba(15, 23, 42, 0.08)",
                  }}
                >
                  <div
                    style={{
                      aspectRatio: "1 / 1",
                      background: "#f8fafc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={activeImage}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/900x900?text=Image+Not+Found";
                      }}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <div className="row g-2">
                    {galleryItems.map((item, index) => (
                      <div className="col-4" key={`${item.label}-${index}`}>
                        <button
                          type="button"
                          onClick={() => setActiveImage(item.src)}
                          style={{
                            width: "100%",
                            border:
                              activeImage === item.src
                                ? "2px solid #4f46e5"
                                : "1px solid #e5e7eb",
                            borderRadius: "16px",
                            padding: "0.35rem",
                            background:
                              activeImage === item.src
                                ? "rgba(79,70,229,0.04)"
                                : "#fff",
                            boxShadow:
                              activeImage === item.src
                                ? "0 10px 24px rgba(79,70,229,0.16)"
                                : "0 8px 18px rgba(15,23,42,0.04)",
                            transition:
                              "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                            display: "block",
                            textAlign: "left",
                          }}
                        >
                          <div
                            style={{
                              aspectRatio: "1 / 1",
                              borderRadius: "12px",
                              overflow: "hidden",
                              marginBottom: "0.4rem",
                            }}
                          >
                            <img
                              src={item.src}
                              alt={item.label}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/300x300?text=No+Image";
                              }}
                            />
                          </div>
                          <div
                            style={{
                              fontSize: "0.72rem",
                              fontWeight: "600",
                              color: "#475569",
                            }}
                          >
                            {item.label}
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                {product.category && (
                  <span
                    className="badge rounded-pill px-3 py-2"
                    style={{
                      background: "rgba(79, 70, 229, 0.10)",
                      color: "#4f46e5",
                      border: "1px solid rgba(79, 70, 229, 0.16)",
                      fontWeight: 700,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {product.category.name}
                  </span>
                )}
                <span
                  className="badge rounded-pill px-3 py-2"
                  style={{
                    background: stockStatus.bg,
                    color: stockStatus.color,
                    border: `1px solid ${stockStatus.color}22`,
                    fontWeight: 700,
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      display: "inline-block",
                      background: stockStatus.color,
                      marginRight: "0.4rem",
                    }}
                  />
                  {stockStatus.label}
                </span>
              </div>

              <h1
                style={{
                  fontSize: "2rem",
                  lineHeight: 1.15,
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {product.name}
              </h1>

              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <StarRating
                  rating={Math.round(averageRating || 0)}
                  readOnly
                  size="1.05rem"
                />
                <span
                  style={{
                    color: "#f59e0b",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                  }}
                >
                  {reviews.length ? averageRating.toFixed(1) : "0.0"}
                </span>
                <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                  {reviews.length
                    ? `(${reviews.length} ulasan)`
                    : "Belum ada ulasan"}
                </span>
              </div>

              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(79,70,229,0.08), rgba(14,165,233,0.05))",
                  borderRadius: "20px",
                  padding: "1.1rem 1.25rem",
                  border: "1px solid rgba(79,70,229,0.12)",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.86rem",
                    color: "#64748b",
                    fontWeight: 600,
                    marginBottom: "0.35rem",
                  }}
                >
                  Harga Produk
                </div>
                <div
                  style={{
                    fontSize: "2.1rem",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    color: "#4f46e5",
                    lineHeight: 1,
                  }}
                >
                  Rp {product.price.toLocaleString("id-ID")}
                </div>
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: "18px",
                  padding: "1rem 1.1rem",
                  border: "1px solid #e5e7eb",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: "#0f172a",
                    marginBottom: "0.4rem",
                  }}
                >
                  Deskripsi Produk
                </div>
                <p
                  className="mb-0"
                  style={{
                    color: "#475569",
                    lineHeight: 1.75,
                    whiteSpace: "pre-line",
                    fontSize: "0.98rem",
                  }}
                >
                  {product.description}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.25rem",
                  padding: "0.95rem 1rem",
                  borderRadius: "18px",
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                }}
              >
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: stockStatus.color,
                    boxShadow: `0 0 0 6px ${stockStatus.color}18`,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#0f172a",
                      fontSize: "0.92rem",
                    }}
                  >
                    {stockStatus.label === "Tersedia"
                      ? "Ready Stock"
                      : "Stok Habis"}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "0.85rem" }}>
                    Sisa stok: {product.stock} unit
                  </div>
                </div>
              </div>

              {product.stock > 0 ? (
                <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                  <div
                    className="input-group"
                    style={{
                      width: "150px",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
                    }}
                  >
                    <button
                      className="btn btn-light border"
                      type="button"
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                      disabled={quantity <= 1}
                      style={{ fontWeight: 700 }}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="form-control text-center fw-bold"
                      value={quantity}
                      readOnly
                      style={{
                        background: "#fff",
                        borderLeft: "none",
                        borderRight: "none",
                      }}
                    />
                    <button
                      className="btn btn-light border"
                      type="button"
                      onClick={() =>
                        setQuantity((prev) => Math.min(product.stock, prev + 1))
                      }
                      disabled={quantity >= product.stock}
                      style={{ fontWeight: 700 }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="btn btn-primary px-4 py-3 fw-semibold"
                    onClick={handleAddToCart}
                    style={{
                      borderRadius: "16px",
                      minWidth: "210px",
                      background: "linear-gradient(135deg, #4f46e5, #2563eb)",
                      border: "none",
                      boxShadow: "0 14px 30px rgba(79,70,229,0.22)",
                    }}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    Masukkan Keranjang
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    disabled={wishlistLoading}
                    className="btn px-4 py-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    style={{
                      borderRadius: "16px",
                      minWidth: "180px",
                      background: isWishlisted
                        ? "rgba(239, 68, 68, 0.08)"
                        : "#fff",
                      color: isWishlisted ? "#dc2626" : "#0f172a",
                      border: isWishlisted
                        ? "1px solid rgba(220,38,38,0.18)"
                        : "1px solid #e5e7eb",
                      boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
                    }}
                  >
                    <i
                      className={`bi ${isWishlisted ? "bi-heart-fill text-danger" : "bi-heart"}`}
                    ></i>
                    {wishlistLoading ? "Menyimpan..." : "Wishlist"}
                  </button>
                </div>
              ) : (
                <div
                  className="alert alert-warning mt-2"
                  role="alert"
                  style={{ borderRadius: "16px" }}
                >
                  Maaf, stok produk ini sedang kosong.
                </div>
              )}

              <div className="row g-3 mt-2">
                {[
                  {
                    title: "Original Product",
                    text: "Barang asli dengan kualitas terjamin",
                    icon: "bi-shield-check",
                  },
                  {
                    title: "Fast Shipping",
                    text: "Pengiriman cepat dan aman",
                    icon: "bi-truck",
                  },
                  {
                    title: "Secure Payment",
                    text: "Pembayaran aman dan terpercaya",
                    icon: "bi-lock",
                  },
                  {
                    title: "Easy Return",
                    text: "Proses retur mudah dan jelas",
                    icon: "bi-arrow-repeat",
                  },
                ].map((item) => (
                  <div className="col-6 col-xl-3" key={item.title}>
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: "18px",
                        border: "1px solid #e5e7eb",
                        padding: "1rem",
                        height: "100%",
                        boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
                      }}
                    >
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "14px",
                          background:
                            "linear-gradient(135deg, rgba(79,70,229,0.12), rgba(14,165,233,0.12))",
                          color: "#4f46e5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "0.75rem",
                          fontSize: "1.1rem",
                        }}
                      >
                        <i className={`bi ${item.icon}`} />
                      </div>
                      <div
                        style={{
                          fontWeight: 800,
                          color: "#0f172a",
                          fontSize: "0.92rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          color: "#64748b",
                          fontSize: "0.82rem",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "22px",
                overflow: "hidden",
                boxShadow: "0 14px 34px rgba(15,23,42,0.05)",
              }}
            >
              <div
                style={{
                  padding: "0.6rem",
                  borderBottom: "1px solid #e5e7eb",
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                  background:
                    "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                }}
              >
                {[
                  { key: "description", label: "Description" },
                  { key: "specifications", label: "Specifications" },
                  { key: "reviews", label: "Reviews" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      border: "none",
                      background:
                        activeTab === tab.key
                          ? "linear-gradient(135deg, #4f46e5, #2563eb)"
                          : "transparent",
                      color: activeTab === tab.key ? "#fff" : "#475569",
                      borderRadius: "14px",
                      padding: "0.85rem 1.15rem",
                      fontWeight: 700,
                      boxShadow:
                        activeTab === tab.key
                          ? "0 10px 22px rgba(79,70,229,0.2)"
                          : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div style={{ padding: "1.5rem" }}>
                {activeTab === "description" && (
                  <div className="row g-4 align-items-start">
                    <div className="col-lg-8">
                      <h4
                        style={{
                          fontWeight: 800,
                          color: "#0f172a",
                          marginBottom: "0.75rem",
                        }}
                      >
                        Deskripsi Lengkap
                      </h4>
                      <p
                        style={{
                          color: "#475569",
                          lineHeight: 1.85,
                          whiteSpace: "pre-line",
                          marginBottom: 0,
                          fontSize: "0.98rem",
                        }}
                      >
                        {product.description}
                      </p>
                    </div>
                    <div className="col-lg-4">
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(79,70,229,0.06), rgba(14,165,233,0.04))",
                          borderRadius: "18px",
                          padding: "1.25rem",
                          border: "1px solid rgba(79,70,229,0.12)",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 800,
                            color: "#0f172a",
                            marginBottom: "0.75rem",
                          }}
                        >
                          Highlight Produk
                        </div>
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: "1.1rem",
                            color: "#475569",
                            lineHeight: 1.8,
                          }}
                        >
                          <li>Desain modern dan rapi</li>
                          <li>UI informasi produk yang nyaman dibaca</li>
                          <li>Terintegrasi dengan keranjang dan ulasan</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "specifications" && (
                  <div className="row g-3">
                    {specificationItems.map((item) => (
                      <div className="col-md-6" key={item.label}>
                        <div
                          style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "18px",
                            padding: "1rem 1.1rem",
                            background: "#fff",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.82rem",
                              color: "#64748b",
                              marginBottom: "0.35rem",
                              fontWeight: 600,
                            }}
                          >
                            {item.label}
                          </div>
                          <div
                            style={{
                              fontSize: "0.98rem",
                              fontWeight: 800,
                              color: "#0f172a",
                            }}
                          >
                            {item.value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "1.25rem",
                      }}
                    >
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          background:
                            "linear-gradient(135deg, #4f46e5, #7c3aed)",
                          borderRadius: "14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.15rem",
                          color: "#fff",
                        }}
                      >
                        💬
                      </div>
                      <div>
                        <h4
                          style={{
                            margin: 0,
                            fontWeight: 800,
                            color: "#0f172a",
                          }}
                        >
                          Ulasan Pelanggan
                        </h4>
                        <p
                          style={{
                            margin: 0,
                            color: "#94a3b8",
                            fontSize: "0.86rem",
                          }}
                        >
                          {reviews.length > 0
                            ? `${reviews.length} ulasan dari pembeli yang sudah verifikasi`
                            : "Belum ada ulasan untuk produk ini"}
                        </p>
                      </div>
                    </div>

                    {!reviewLoading && reviews.length > 0 && (
                      <RatingSummary reviews={reviews} />
                    )}

                    {isLoggedIn ? (
                      eligibleOrders.length > 0 ? (
                        <div
                          style={{
                            background: "#fff",
                            borderRadius: "18px",
                            padding: "1.5rem",
                            border: "1px solid #e5e7eb",
                            marginBottom: "1.5rem",
                            boxShadow: "0 10px 24px rgba(79,70,229,0.06)",
                          }}
                        >
                          <h5
                            style={{
                              fontWeight: 800,
                              color: "#4f46e5",
                              marginBottom: "1.25rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <span style={{ fontSize: "1.2rem" }}>✍️</span> Tulis
                            Ulasan Anda
                          </h5>

                          {reviewMsg.text && (
                            <div
                              style={{
                                padding: "0.75rem 1rem",
                                borderRadius: "12px",
                                marginBottom: "1rem",
                                background:
                                  reviewMsg.type === "success"
                                    ? "#dcfce7"
                                    : "#fee2e2",
                                color:
                                  reviewMsg.type === "success"
                                    ? "#166534"
                                    : "#991b1b",
                                fontSize: "0.9rem",
                                fontWeight: "500",
                              }}
                            >
                              {reviewMsg.text}
                            </div>
                          )}

                          <form onSubmit={handleSubmitReview}>
                            <div className="row g-3">
                              <div className="col-lg-6">
                                <label
                                  style={{
                                    display: "block",
                                    fontWeight: 700,
                                    color: "#374151",
                                    marginBottom: "0.4rem",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  Pilih Pesanan
                                </label>
                                <select
                                  id="select-order-review"
                                  className="form-select"
                                  value={reviewForm.order_id}
                                  onChange={(e) =>
                                    setReviewForm((prev) => ({
                                      ...prev,
                                      order_id: e.target.value,
                                    }))
                                  }
                                  required
                                  style={{
                                    borderRadius: "12px",
                                    border: "1.5px solid #e2e8f0",
                                  }}
                                >
                                  <option value="">-- Pilih pesanan --</option>
                                  {eligibleOrders.map((order) => (
                                    <option key={order.id} value={order.id}>
                                      #ORD-{order.id} —{" "}
                                      {new Date(
                                        order.created_at,
                                      ).toLocaleDateString("id-ID")}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="col-lg-6">
                                <label
                                  style={{
                                    display: "block",
                                    fontWeight: 700,
                                    color: "#374151",
                                    marginBottom: "0.4rem",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  Rating
                                </label>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <StarRating
                                    rating={reviewForm.rating}
                                    onRate={(star) =>
                                      setReviewForm((prev) => ({
                                        ...prev,
                                        rating: star,
                                      }))
                                    }
                                    size="2rem"
                                  />
                                  {reviewForm.rating > 0 && (
                                    <span
                                      style={{
                                        color: "#f59e0b",
                                        fontWeight: 700,
                                        fontSize: "0.9rem",
                                      }}
                                    >
                                      {
                                        [
                                          "",
                                          "Sangat Buruk",
                                          "Buruk",
                                          "Cukup",
                                          "Bagus",
                                          "Sangat Bagus",
                                        ][reviewForm.rating]
                                      }
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="col-12">
                                <label
                                  style={{
                                    display: "block",
                                    fontWeight: 700,
                                    color: "#374151",
                                    marginBottom: "0.4rem",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  Komentar{" "}
                                  <span
                                    style={{
                                      color: "#94a3b8",
                                      fontWeight: 400,
                                    }}
                                  >
                                    (opsional)
                                  </span>
                                </label>
                                <textarea
                                  id="review-comment"
                                  className="form-control"
                                  rows={4}
                                  placeholder="Ceritakan pengalaman Anda dengan produk ini..."
                                  value={reviewForm.comment}
                                  onChange={(e) =>
                                    setReviewForm((prev) => ({
                                      ...prev,
                                      comment: e.target.value,
                                    }))
                                  }
                                  style={{
                                    borderRadius: "12px",
                                    border: "1.5px solid #e2e8f0",
                                    resize: "vertical",
                                  }}
                                />
                              </div>
                            </div>

                            <button
                              id="submit-review-btn"
                              type="submit"
                              disabled={submitLoading}
                              style={{
                                marginTop: "1rem",
                                background:
                                  "linear-gradient(135deg, #4f46e5, #7c3aed)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "12px",
                                padding: "0.8rem 1.75rem",
                                fontWeight: 700,
                                fontSize: "0.95rem",
                                cursor: submitLoading
                                  ? "not-allowed"
                                  : "pointer",
                                opacity: submitLoading ? 0.7 : 1,
                                boxShadow: "0 14px 28px rgba(79,70,229,0.18)",
                              }}
                            >
                              {submitLoading ? "Mengirim..." : "Kirim Ulasan"}
                            </button>
                          </form>
                        </div>
                      ) : (
                        <div
                          style={{
                            background: "#fffbeb",
                            border: "1px solid #fde68a",
                            borderRadius: "14px",
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
                            Ulasan hanya dapat diberikan setelah Anda membeli
                            dan membayar produk ini.{" "}
                            <Link
                              to="/"
                              style={{ color: "#4f46e5", fontWeight: 700 }}
                            >
                              Belanja sekarang →
                            </Link>
                          </span>
                        </div>
                      )
                    ) : (
                      <div
                        style={{
                          background: "#eff6ff",
                          border: "1px solid #bfdbfe",
                          borderRadius: "14px",
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
                          <Link
                            to="/login"
                            style={{ color: "#4f46e5", fontWeight: 800 }}
                          >
                            Login
                          </Link>{" "}
                          atau{" "}
                          <Link
                            to="/register"
                            style={{ color: "#4f46e5", fontWeight: 800 }}
                          >
                            Daftar
                          </Link>{" "}
                          untuk memberikan ulasan pada produk ini.
                        </span>
                      </div>
                    )}

                    {reviewLoading ? (
                      <div className="text-center py-4">
                        <div
                          className="spinner-border spinner-border-sm text-primary"
                          role="status"
                        />
                        <span className="ms-2 text-muted">
                          Memuat ulasan...
                        </span>
                      </div>
                    ) : reviews.length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "3rem 1rem",
                          color: "#94a3b8",
                        }}
                      >
                        <div
                          style={{ fontSize: "3rem", marginBottom: "0.75rem" }}
                        >
                          💤
                        </div>
                        <p style={{ fontWeight: 500, margin: 0 }}>
                          Belum ada ulasan. Jadilah yang pertama mengulas!
                        </p>
                      </div>
                    ) : (
                      <>
                        {displayedReviews.map((review) => (
                          <ReviewCard key={review.id} review={review} />
                        ))}

                        {reviews.length > 4 && (
                          <div
                            style={{ textAlign: "center", marginTop: "1rem" }}
                          >
                            <button
                              onClick={() => setShowAllReviews((prev) => !prev)}
                              style={{
                                background: "transparent",
                                border: "1.5px solid #4f46e5",
                                color: "#4f46e5",
                                borderRadius: "12px",
                                padding: "0.6rem 1.5rem",
                                fontWeight: 700,
                                fontSize: "0.9rem",
                                cursor: "pointer",
                                transition: "background 0.2s, color 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = "#4f46e5";
                                e.target.style.color = "#fff";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = "transparent";
                                e.target.style.color = "#4f46e5";
                              }}
                            >
                              {showAllReviews
                                ? "Tampilkan Lebih Sedikit ↑"
                                : `Lihat Semua ${reviews.length} Ulasan ↓`}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
