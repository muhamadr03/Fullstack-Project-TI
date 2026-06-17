// src/components/ui/ProductCard.jsx — Premium Fashion Store Card
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { wishlistApi } from "../../api/wishlistApi";
import { cartApi } from "../../api/cartApi";

const BACKEND_URL = "http://localhost:5000";
const DISCOUNT_POOL = [10, 15, 20, 25, 30];

const ProductCard = ({ product, showAddCart = true }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const navigate = useNavigate();

  const imageUrl = product.image_url
    ? product.image_url.startsWith("http")
      ? product.image_url
      : `${BACKEND_URL}${product.image_url}`
    : "https://placehold.co/400x400?text=No+Image";

  // Simulasi diskon (setiap produk dengan id genap)
  const hasDiscount = (product.id % 2 === 0);
  const discountPct = DISCOUNT_POOL[(product.id || 0) % DISCOUNT_POOL.length];
  const originalPrice = hasDiscount
    ? Math.round(product.price / (1 - discountPct / 100))
    : null;

  const isNew = (product.id % 7 === 0);

  const rating = product.average_rating
    ? parseFloat(product.average_rating)
    : (3.5 + ((product.id % 15) / 10));

  const ratingRounded = Math.min(5, parseFloat(rating.toFixed(1)));
  const reviewCount = product.total_reviews || ((product.id || 1) * 17 % 500 + 10);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistLoading(true);
    try {
      const res = await wishlistApi.toggleWishlist(product.id);
      setWishlisted(res.data?.action === "added");
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCartLoading(true);
    try {
      await cartApi.addToCart(product.id, 1);
      setCartAdded(true);
      setTimeout(() => setCartAdded(false), 2000);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      }
    } finally {
      setCartLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < full) stars.push(<i key={i} className="bi bi-star-fill lx-star" />);
      else if (i === full && half) stars.push(<i key={i} className="bi bi-star-half lx-star" />);
      else stars.push(<i key={i} className="bi bi-star lx-star" style={{ color: "#e0e0e0" }} />);
    }
    return stars;
  };

  return (
    <div className="lx-product-card h-100">
      {/* Image */}
      <Link to={`/products/${product.id}`} className="lx-product-img-wrap d-block" style={{ position: "relative" }}>
        <img
          src={imageUrl}
          alt={product.name}
          className="lx-product-img"
          loading="lazy"
          onError={(e) => { e.target.src = "https://placehold.co/400x400?text=No+Image"; }}
        />

        {/* Badges */}
        {hasDiscount && (
          <span className="lx-product-badge sale">-{discountPct}%</span>
        )}
        {isNew && !hasDiscount && (
          <span className="lx-product-badge new">New</span>
        )}

        {/* Wishlist */}
        <button
          className={`lx-product-wishlist ${wishlisted ? "active" : ""}`}
          onClick={handleWishlist}
          disabled={wishlistLoading}
          title="Add to Wishlist"
        >
          <i className={`bi bi-heart${wishlisted ? "-fill" : ""}`} />
        </button>
      </Link>

      {/* Body */}
      <Link to={`/products/${product.id}`} className="lx-product-body text-decoration-none" style={{ display: "flex", flexDirection: "column", flex: 1, gap: 5, padding: "16px 16px 4px" }}>
        {/* Category */}
        {product.category && (
          <span className="lx-product-cat">{product.category.name}</span>
        )}

        {/* Name */}
        <h6 className="lx-product-name">{product.name}</h6>

        {/* Rating */}
        <div className="lx-product-rating">
          {renderStars(ratingRounded)}
          <span style={{ fontWeight: 600, color: "#1f1f1f", marginLeft: 2 }}>{ratingRounded}</span>
          <span style={{ color: "#bbb" }}>({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="lx-product-price-row">
          <span className="lx-product-price">
            Rp {product.price.toLocaleString("id-ID")}
          </span>
          {hasDiscount && originalPrice && (
            <>
              <span className="lx-product-old-price">
                Rp {originalPrice.toLocaleString("id-ID")}
              </span>
              <span className="lx-product-discount">-{discountPct}%</span>
            </>
          )}
        </div>
      </Link>

      {/* Add to Cart */}
      {showAddCart && (
        <div className="lx-product-footer">
          <button
            className="lx-add-cart-btn"
            onClick={handleAddCart}
            disabled={cartLoading}
          >
            {cartLoading ? (
              <><span className="spinner-border spinner-border-sm" role="status" /> Adding...</>
            ) : cartAdded ? (
              <><i className="bi bi-check2" /> Added!</>
            ) : (
              <><i className="bi bi-bag-plus" /> Add to Cart</>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;