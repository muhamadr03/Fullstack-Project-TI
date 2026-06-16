import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { wishlistApi } from "../../api/wishlistApi";

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const backendUrl = "http://localhost:5000";
  const imageUrl = product.image_url
    ? (product.image_url.startsWith('http') ? product.image_url : `${backendUrl}${product.image_url}`)
    : "https://via.placeholder.com/300x300?text=No+Image";

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <div className="card card-premium h-100 position-relative overflow-hidden shadow-sm">
      {product.category && (
        <span 
          className="badge position-absolute top-0 start-0 m-3 z-1 px-3 py-2 fw-bold rounded-pill border"
          style={{
            background: "rgba(79, 70, 229, 0.1)",
            color: "var(--bs-primary)",
            borderColor: "rgba(79, 70, 229, 0.2)",
            backdropFilter: "blur(8px)",
            fontSize: "0.75rem"
          }}
        >
          {product.category.name}
        </span>
      )}

      {/* Tombol Wishlist (Hati) */}
      <button 
        onClick={handleToggleWishlist}
        disabled={loading}
        className="btn btn-sm btn-light position-absolute top-0 end-0 m-3 z-1 rounded-circle shadow-sm border border-light d-flex align-items-center justify-content-center"
        style={{ 
          width: "36px", 
          height: "36px", 
          padding: 0,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(4px)",
          transition: "transform 0.2s ease"
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        title="Simpan ke Wishlist"
      >
        <i className={`bi bi-heart${isWishlisted ? "-fill text-danger" : " text-muted"}`} style={{ fontSize: "1rem" }}></i>
      </button>

      <div className="card-img-wrapper" style={{ height: "200px" }}>
        <img
          src={imageUrl}
          className="card-img-top card-img-top-zoom h-100 w-100"
          alt={product.name}
          style={{ objectFit: "cover" }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x300?text=Image+Not+Found";
          }}
        />
      </div>

      <div className="card-body d-flex flex-column text-center p-4">
        <h5 className="card-title text-truncate mb-2 fw-bold text-dark" title={product.name} style={{ fontSize: "1.05rem" }}>
          {product.name}
        </h5>

        <div className="mb-2 d-flex align-items-center justify-content-center gap-1" style={{ fontSize: "0.85rem" }}>
          <i className="bi bi-star-fill text-warning"></i>
          <span className="text-dark fw-semibold">
            {product.average_rating ? parseFloat(product.average_rating).toFixed(1) : "New"}
          </span>
          {product.total_reviews > 0 && (
            <span className="text-muted">({product.total_reviews})</span>
          )}
        </div>

        <p className="card-text text-primary fw-bold fs-5 mb-3">
          Rp {product.price.toLocaleString("id-ID")}
        </p>

        <div className="mt-auto d-grid">
          <Link 
            to={`/products/${product.id}`} 
            className="btn btn-primary fw-semibold py-2"
            style={{ borderRadius: "10px", fontSize: "0.9rem" }}
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;