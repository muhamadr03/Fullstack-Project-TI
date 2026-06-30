// src/components/ui/FlashSaleCard.jsx — tidak dipakai di halaman baru, retained for compatibility
import React from "react";
import { Link } from "react-router-dom";

const BACKEND_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const FlashSaleCard = ({ product, discountPct = 30 }) => {
  const imageUrl = product.image_url
    ? product.image_url.startsWith("http")
      ? product.image_url
      : `${BACKEND_URL}${product.image_url}`
    : "https://placehold.co/300x300?text=No+Image";

  const originalPrice = Math.round(product.price / (1 - discountPct / 100));

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: "none" }}>
      <div className="lx-product-card" style={{ width: 180 }}>
        <div className="lx-product-img-wrap" style={{ aspectRatio: "1/1" }}>
          <img src={imageUrl} alt={product.name} className="lx-product-img" loading="lazy"
            onError={(e) => { e.target.src = "https://placehold.co/300x300?text=No+Image"; }} />
          <span className="lx-product-badge sale">-{discountPct}%</span>
        </div>
        <div className="lx-product-body" style={{ padding: "12px" }}>
          <p className="lx-product-name" style={{ fontSize: "0.78rem" }}>{product.name}</p>
          <div className="lx-product-price-row">
            <span className="lx-product-price" style={{ fontSize: "0.9rem", color: "#e53935" }}>
              Rp {product.price.toLocaleString("id-ID")}
            </span>
          </div>
          <span className="lx-product-old-price">Rp {originalPrice.toLocaleString("id-ID")}</span>
        </div>
      </div>
    </Link>
  );
};

export default FlashSaleCard;
