// src/components/ui/ProductCard.jsx — Premium Fashion Store Card
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { wishlistApi } from "../../api/wishlistApi";
import { cartApi } from "../../api/cartApi";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import { useContext } from "react";

const BACKEND_URL = "http://localhost:5000";
const DISCOUNT_POOL = [10, 15, 20, 25, 30];

const ProductCard = ({ product, showAddCart = true }) => {
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { isWishlisted, toggleWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const wishlisted = isWishlisted(product.id);

  let mainImage = "";
  if (product.images && product.images.length > 0) {
    mainImage = product.images[0].image_url;
  }
  const imageUrl = mainImage
    ? mainImage.startsWith("http")
      ? mainImage
      : `${BACKEND_URL}/${mainImage.replace(/\\/g, "/")}`
    : "https://placehold.co/400x400?text=No+Image";

  // Simulasi diskon (setiap produk dengan id genap)
  const hasDiscount = (product.id % 2 === 0);
  const discountPct = DISCOUNT_POOL[(product.id || 0) % DISCOUNT_POOL.length];
  const originalPrice = hasDiscount
    ? Math.round(product.price / (1 - discountPct / 100))
    : null;

  const isNew = (product.id % 7 === 0);

  // Gunakan data asli dari database
  // Jika total_reviews 0, maka rating juga 0
  const rating = parseFloat(product.average_rating || 0);
  const ratingRounded = Math.min(5, parseFloat(rating.toFixed(1)));
  const reviewCount = parseInt(product.total_reviews || 0, 10);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistLoading(true);
    try {
      const res = await toggleWishlist(product.id);
      if (!res.success && (res.message?.toLowerCase().includes("token") || res.message?.toLowerCase().includes("login"))) {
        navigate("/login");
      }
    } catch (err) {
      navigate("/login");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCartLoading(true);
    try {
      const result = await addToCart(product.id, 1);
      if (result.success) {
        setCartAdded(true);
        setTimeout(() => setCartAdded(false), 2000);
      } else if (result.message && (result.message.toLowerCase().includes("token") || result.message.toLowerCase().includes("login"))) {
        navigate("/login");
      } else {
        alert(`Gagal menambah ke keranjang: ${result.message}`);
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      }
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCartLoading(true);
    try {
      const result = await addToCart(product.id, 1);
      if (result.success) {
        navigate("/checkout");
      } else if (result.message && (result.message.toLowerCase().includes("token") || result.message.toLowerCase().includes("login"))) {
        navigate("/login");
      } else {
        alert(`Gagal memproses pembelian: ${result.message}`);
      }
    } catch (err) {
      navigate("/login");
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
          <span className="lx-product-badge new">Baru</span>
        )}

        {/* Wishlist */}
        <button
          className={`lx-product-wishlist ${wishlisted ? "active" : ""}`}
          onClick={handleWishlist}
          disabled={wishlistLoading}
          title="Tambah ke Wishlist"
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

      {/* Add to Cart & Buy Now */}
      {showAddCart && (
        <div className="lx-product-footer" style={{ display: "flex", gap: "8px" }}>
          <button
            className="lx-add-cart-btn"
            style={{ flex: 1, fontSize: "0.85rem", padding: "8px 4px" }}
            onClick={handleAddCart}
            disabled={cartLoading}
          >
            {cartLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" />
            ) : cartAdded ? (
              <><i className="bi bi-check2" /> Masuk</>
            ) : (
              <><i className="bi bi-cart-plus" /> Keranjang</>
            )}
          </button>

          <button
            className="lx-add-cart-btn"
            style={{ flex: 1.2, fontSize: "0.85rem", padding: "8px 4px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none" }}
            onClick={handleBuyNow}
            disabled={cartLoading}
          >
            <i className="bi bi-bag-check" /> Beli
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;