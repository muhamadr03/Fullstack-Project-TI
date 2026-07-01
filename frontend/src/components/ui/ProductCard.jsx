// src/components/ui/ProductCard.jsx — Premium Fashion Store Card
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { wishlistApi } from "../../api/wishlistApi";
import { cartApi } from "../../api/cartApi";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import { useContext } from "react";
import toast from 'react-hot-toast';

const BACKEND_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
const DISCOUNT_POOL = [10, 15, 20, 25, 30];

const ProductCard = ({ product, showAddCart = true }) => {
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [actionType, setActionType] = useState("cart");
  const { addToCart } = useContext(CartContext);
  const { isWishlisted, toggleWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const variants = product.variants || product.ProductVariants || [];

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
    if (variants.length > 0) {
      setSelectedVariant(variants[0]);
      setActionType("cart");
      setShowVariantModal(true);
      return;
    }
    await executeAddToCart(null, "cart");
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (variants.length > 0) {
      setSelectedVariant(variants[0]);
      setActionType("buy");
      setShowVariantModal(true);
      return;
    }
    await executeAddToCart(null, "buy");
  };

  const executeAddToCart = async (variant = null, type = "cart") => {
    setCartLoading(true);
    setShowVariantModal(false);
    try {
      const sizeLabel = variant ? (variant.attributes?.map(a => `${a.attribute_value}`).join(' - ') || variant.sku || `Varian #${variant.id}`) : null;
      const variantId = variant ? variant.id : null;
      const result = await addToCart(product.id, 1, imageUrl, sizeLabel, variantId);
      if (result.success) {
        if (type === "buy") {
          const cartItemId = result.data?.id;
          navigate("/checkout", { state: { selectedItems: cartItemId ? [cartItemId] : [] } });
        } else {
          setCartAdded(true);
          setTimeout(() => setCartAdded(false), 2000);
        }
      } else if (result.message && (result.message.toLowerCase().includes("token") || result.message.toLowerCase().includes("login"))) {
        navigate("/login");
      } else {
        toast.error(`Gagal memproses: ${result.message}`);
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      } else {
        toast.error("Terjadi kesalahan saat memproses pesanan.");
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
      <div className="lx-product-footer d-flex flex-wrap flex-sm-nowrap gap-2" style={{ padding: "0 16px 16px", marginTop: "auto" }}>
        <button
          className="lx-add-cart-btn flex-grow-1"
          style={{ fontSize: "0.8rem", padding: "8px 4px", minWidth: "100px" }}
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
          className="lx-add-cart-btn flex-grow-1"
          style={{ fontSize: "0.8rem", padding: "8px 4px", minWidth: "100px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none" }}
          onClick={handleBuyNow}
          disabled={cartLoading}
        >
          <i className="bi bi-bag-check" /> Beli
        </button>
      </div>
    )}

    {/* Modal Pilih Varian */}
      {showVariantModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.6)", zIndex: 1050, backdropFilter: "blur(4px)" }}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowVariantModal(false); }}
        >
          <div
            className="card border-0 shadow-lg p-4 rounded-4 bg-white"
            style={{ width: "90%", maxWidth: "380px", animation: "fadeIn 0.2s ease-in-out" }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h6 className="fw-bold mb-0 text-dark">
                <i className="bi bi-tag-fill me-2 text-primary"></i>Pilih Varian Produk
              </h6>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowVariantModal(false)}
              ></button>
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <img src={imageUrl} alt="" style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }} />
              <div>
                <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: 220, fontSize: "0.9rem" }}>{product.name}</div>
                <div className="text-primary fw-bold fs-6">
                  Rp {(selectedVariant?.price || product.price).toLocaleString("id-ID")}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-muted fw-semibold mb-2 d-block" style={{ fontSize: "0.8rem" }}>Varian Tersedia:</label>
              <div className="d-flex flex-wrap gap-2">
                {variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const label = v.attributes?.map(a => `${a.attribute_value}`).join(' - ') || v.sku || `Varian #${v.id}`;
                  const isOut = v.stock <= 0;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={isOut}
                      onClick={() => setSelectedVariant(v)}
                      className={`btn btn-sm px-3 py-2 rounded-3 fw-medium ${isSelected ? "btn-primary shadow-sm" : "btn-outline-secondary"} ${isOut ? "opacity-50 text-decoration-line-through" : ""}`}
                      style={{ fontSize: "0.85rem" }}
                    >
                      {label} {isOut && "(Habis)"}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary w-100 py-2 fw-bold rounded-3 shadow-sm"
              disabled={!selectedVariant || selectedVariant.stock <= 0}
              onClick={() => executeAddToCart(selectedVariant, actionType)}
            >
              {actionType === "buy" ? (
                <><i className="bi bi-bag-check me-2"></i>Beli Sekarang</>
              ) : (
                <><i className="bi bi-cart-plus me-2"></i>Masukkan Keranjang</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;