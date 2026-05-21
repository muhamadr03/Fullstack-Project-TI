import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { wishlistApi } from "../../api/wishlistApi";

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const backendUrl = "http://localhost:5000";
  const imageUrl = product.image_url
    ? `${backendUrl}${product.image_url}`
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
    <div className="card h-100 shadow-sm border-0 position-relative transition-hover overflow-hidden">
      {product.category && (
        <span className="badge bg-dark position-absolute top-0 start-0 m-2 z-1">
          {product.category.name}
        </span>
      )}

      {/* Tombol Wishlist (Hati) */}
      <button 
        onClick={handleToggleWishlist}
        disabled={loading}
        className="btn btn-sm btn-light position-absolute top-0 end-0 m-2 z-1 rounded-circle shadow-sm"
        style={{ width: "32px", height: "32px", padding: 0 }}
      >
        <i className={`bi bi-heart${isWishlisted ? "-fill text-danger" : " text-muted"}`}></i>
      </button>

      <img
        src={imageUrl}
        className="card-img-top"
        alt={product.name}
        style={{ objectFit: "cover", height: "200px" }}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300x300?text=Image+Not+Found";
        }}
      />

      <div className="card-body d-flex flex-column text-center">
        <h5 className="card-title text-truncate mb-1 fw-bold" title={product.name}>
          {product.name}
        </h5>

        <div className="mb-2 text-warning" style={{ fontSize: "0.9rem" }}>
          <i className="bi bi-star-fill"></i>{" "}
          <span className="text-muted ms-1 text-dark fw-medium">
            {product.average_rating ? parseFloat(product.average_rating).toFixed(1) : "Baru"}
          </span>
        </div>

        <p className="card-text text-primary fw-bold fs-5 mb-3">
          Rp {product.price.toLocaleString("id-ID")}
        </p>

        <div className="mt-auto d-grid gap-2">
          <Link to={`/products/${product.id}`} className="btn btn-primary btn-sm fw-medium">
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;