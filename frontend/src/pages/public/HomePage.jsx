// src/pages/public/HomePage.jsx — Premium Fashion Store
import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productApi } from "../../api/productApi";
import { categoryApi } from "../../api/categoryApi";
import { cartApi } from "../../api/cartApi";
import ProductCard from "../../components/ui/ProductCard";
import CountdownTimer from "../../components/ui/CountdownTimer";
import { ProductSkeleton, CategorySkeleton } from "../../components/ui/SkeletonCard";
import { CartContext } from "../../context/CartContext";

const BACKEND_URL = "http://localhost:5000";

const imgUrl = (url) =>
  !url
    ? "https://placehold.co/600x800?text=Category"
    : url.startsWith("http")
    ? url
    : `${BACKEND_URL}${url}`;

/* ─── STATIC CONTENT ─────────────────────────────────────── */
const FEATURES = [
  { icon: "bi-truck", title: "Free Shipping", desc: "Free delivery on all orders above Rp 200.000 within Indonesia." },
  { icon: "bi-headset", title: "24/7 Support", desc: "Our customer support team is always ready to help you anytime." },
  { icon: "bi-shield-lock", title: "Secure Payment", desc: "Your transactions are protected with bank-grade encryption." },
  { icon: "bi-arrow-counterclockwise", title: "Money Back", desc: "Not satisfied? Get a full refund within 30 days, no questions asked." },
];

const TESTIMONIALS = [
  {
    id: 1, rating: 5,
    quote: "LuxeStore has completely transformed my shopping experience. The quality of products is exceptional, and the delivery was faster than expected. Highly recommend to everyone!",
    name: "Amelia Hartono", role: "Fashion Enthusiast, Jakarta",
    initials: "AH", color: "#ff9800",
  },
  {
    id: 2, rating: 5,
    quote: "I've been shopping here for 6 months and every single product has been exactly as described. Customer service is incredibly responsive and helpful. 5 stars!",
    name: "Reza Pramana", role: "Tech Lover, Surabaya",
    initials: "RP", color: "#9c27b0",
  },
  {
    id: 3, rating: 5,
    quote: "The curated product selection is top-notch. I love how everything feels premium. The packaging is beautiful too — makes every order feel like a gift!",
    name: "Sinta Dewi", role: "Lifestyle Blogger, Bali",
    initials: "SD", color: "#e91e63",
  },
];

/* ─── EMPTY STATE ─── */
const EmptyState = ({ icon, title, desc, action }) => (
  <div className="text-center py-5">
    <i className={`bi ${icon}`} style={{ fontSize: "3.5rem", color: "#e0e0e0" }} />
    <h5 className="mt-3 font-poppins fw-700" style={{ color: "#1f1f1f" }}>{title}</h5>
    <p style={{ color: "#999", fontSize: "0.88rem" }}>{desc}</p>
    {action}
  </div>
);

/* ─── MAIN COMPONENT ──────────────────────────────────────── */
const HomePage = () => {
  /* Products */
  const [products, setProducts]       = useState([]);
  const [prodLoading, setProdLoading] = useState(true);
  const [prodError, setProdError]     = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);

  /* Deals */
  const [deals, setDeals]             = useState([]);
  const [dealsLoading, setDealsLoading] = useState(true);

  /* Categories */
  const [categories, setCategories]   = useState([]);
  const [catsLoading, setCatsLoading] = useState(true);

  /* Filters */
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters]         = useState({
    search: "", sortBy: "newest", category: "", rating: "", minPrice: "", maxPrice: "",
  });

  /* Cart context for refetch */
  const { fetchCart } = useContext(CartContext);
  const navigate = useNavigate();

  /* ─── FETCH ─── */
  const fetchProducts = useCallback(async () => {
    setProdLoading(true);
    setProdError(null);
    try {
      const res = await productApi.getAllProducts({
        page: currentPage, limit: 8,
        ...filters,
      });
      setProducts(res.data || []);
      setTotalPages(res.pagination?.total_pages || 1);
    } catch {
      setProdError("Failed to load products.");
    } finally {
      setProdLoading(false);
    }
  }, [currentPage, filters]);

  const fetchDeals = async () => {
    setDealsLoading(true);
    try {
      const res = await productApi.getAllProducts({ page: 1, limit: 4, sortBy: "price_desc" });
      setDeals(res.data || []);
    } catch {
      setDeals([]);
    } finally {
      setDealsLoading(false);
    }
  };

  const fetchCategories = async () => {
    setCatsLoading(true);
    try {
      const data = await categoryApi.getAllCategories();
      setCategories(Array.isArray(data) ? data : data?.data || []);
    } catch {
      setCategories([]);
    } finally {
      setCatsLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchDeals(); fetchCategories(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setFilters((p) => ({ ...p, search: searchInput }));
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCatFilter = (slug) => {
    setCurrentPage(1);
    setFilters((p) => ({ ...p, category: slug }));
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  /* ─── RENDER ─── */
  return (
    <div style={{ background: "var(--bg)" }}>

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="lx-section-sm" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div className="container-xl px-3">
          <div
            className="lx-hero"
            style={{ minHeight: 580 }}
          >
            {/* LEFT */}
            <div className="col-12 col-lg-6 px-4 px-lg-5 py-5">
              <div className="lx-hero-badge">
                <span className="dot" /> New Collection 2025
              </div>

              <h1 className="lx-hero-title">
                Everything<br />
                You Need<br />
                <span className="accent">In One Store.</span>
              </h1>

              <p className="lx-hero-desc">
                Discover our curated collection of premium fashion, electronics, and lifestyle products — all in one beautiful place.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-5">
                <a
                  href="#products"
                  className="btn btn-primary btn-lg px-5 fw-semibold"
                  style={{ fontSize: "0.9rem" }}
                >
                  Shop Now <i className="bi bi-arrow-right ms-1" />
                </a>
                <a
                  href="#categories"
                  className="btn btn-outline-primary btn-lg px-5 fw-semibold"
                  style={{ fontSize: "0.9rem" }}
                >
                  Browse Categories
                </a>
              </div>

              {/* Stats */}
              <div className="d-flex gap-4">
                {[
                  { num: "10K+", label: "Products" },
                  { num: "50K+", label: "Customers" },
                  { num: "4.9★", label: "Rating" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="lx-hero-stat-num">{s.num}</div>
                    <div className="lx-hero-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — model image */}
            <div
              className="col-12 col-lg-6 d-none d-lg-block lx-hero-img-wrap"
              style={{ position: "relative" }}
            >
              <img
                src="/hero_model.png"
                alt="Fashion Model"
                className="lx-hero-img"
                loading="eager"
              />
              {/* Floating badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: 40, left: -20,
                  background: "#fff",
                  borderRadius: 16,
                  padding: "12px 18px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  display: "flex", alignItems: "center", gap: 10,
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="bi bi-bag-check" style={{ color: "var(--primary)", fontSize: "1rem" }} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#1f1f1f" }}>
                    Free Delivery
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#999" }}>On all orders</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section className="lx-section-sm" style={{ background: "var(--bg-soft)" }}>
        <div className="container-xl px-3">
          <div className="row g-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="col-12 col-sm-6 col-xl-3">
                <div className="lx-feature-card">
                  <div className="lx-feature-icon">
                    <i className={`bi ${f.icon}`} />
                  </div>
                  <h6 className="lx-feature-title">{f.title}</h6>
                  <p className="lx-feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CATEGORIES (DYNAMIC FROM API)
      ══════════════════════════════════════════ */}
      <section className="lx-section" id="categories">
        <div className="container-xl px-3">
          {/* Heading */}
          <div className="text-center mb-5">
            <span className="section-eyebrow">Collections</span>
            <h2 className="section-heading">Shop by Category</h2>
            <div className="divider-line divider-center mt-2" />
            <p className="section-sub mt-3">
              Explore our curated categories and find exactly what you're looking for.
            </p>
          </div>

          {/* Category Grid */}
          {catsLoading ? (
            <div className="row g-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-3">
                  <CategorySkeleton />
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <EmptyState
              icon="bi-grid"
              title="No categories yet"
              desc="Categories will appear here once added."
            />
          ) : (
            <div className="row g-4">
              {categories.map((cat) => (
                <div key={cat.id} className="col-12 col-sm-6 col-lg-3">
                  <a
                    className="lx-cat-card"
                    href={`/?category=${cat.slug || cat.name?.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleCatFilter(cat.slug || cat.name?.toLowerCase());
                    }}
                  >
                    <img
                      src={imgUrl(cat.image_url || cat.image)}
                      alt={cat.name}
                      className="lx-cat-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/400x530?text=${encodeURIComponent(cat.name)}`;
                      }}
                    />
                    <div className="lx-cat-info">
                      <span className="lx-cat-name">{cat.name}</span>
                      <span className="lx-cat-arrow">
                        Shop now <i className="bi bi-arrow-right" />
                      </span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* View All */}
          <div className="text-center mt-5">
            <button
              className="btn btn-outline-primary px-5 py-2 fw-semibold"
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
            >
              View All Categories <i className="bi bi-arrow-right ms-1" />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          POPULAR PRODUCTS (DYNAMIC FROM API)
      ══════════════════════════════════════════ */}
      <section className="lx-section" id="products" style={{ background: "var(--bg-soft)" }}>
        <div className="container-xl px-3">
          {/* Heading */}
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 mb-5">
            <div>
              <span className="section-eyebrow">Trending</span>
              <h2 className="section-heading mb-0">Popular Products</h2>
              <div className="divider-line mt-2" />
            </div>
            {/* Quick filters */}
            <div className="d-flex flex-wrap gap-2 align-items-center">
              {[
                { label: "All", val: "" },
                { label: "Newest", val: "newest" },
                { label: "Price ↑", val: "price_asc" },
                { label: "Price ↓", val: "price_desc" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  className={`btn btn-sm rounded-pill px-4 fw-semibold`}
                  style={{
                    fontSize: "0.8rem",
                    background: filters.sortBy === opt.val || (opt.val === "" && filters.category === "") ? "var(--primary)" : "#f0f0f0",
                    color: filters.sortBy === opt.val || (opt.val === "" && filters.category === "") ? "#fff" : "#666",
                    border: "none",
                    transition: "all 0.2s",
                  }}
                  onClick={() => {
                    if (opt.val === "") {
                      setFilters((p) => ({ ...p, sortBy: "newest", category: "" }));
                    } else {
                      setFilters((p) => ({ ...p, sortBy: opt.val }));
                    }
                    setCurrentPage(1);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search inline */}
          <form onSubmit={handleSearch} className="lx-search mb-5" style={{ maxWidth: 440 }}>
            <i className="bi bi-search me-2" style={{ color: "#bbb", fontSize: "0.85rem", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="lx-search-btn">
              <i className="bi bi-search" />
            </button>
          </form>

          {/* Active filters chips */}
          {(filters.search || filters.category) && (
            <div className="d-flex flex-wrap gap-2 mb-4">
              {filters.search && (
                <span className="badge rounded-pill d-flex align-items-center gap-1"
                  style={{ background: "var(--primary-light)", color: "var(--primary)", fontWeight: 600, fontSize: "0.78rem", padding: "6px 12px" }}>
                  Search: {filters.search}
                  <button style={{ background: "none", border: "none", padding: 0, marginLeft: 4, cursor: "pointer", color: "var(--primary)" }}
                    onClick={() => setFilters((p) => ({ ...p, search: "" }))}>
                    <i className="bi bi-x-lg" style={{ fontSize: "0.7rem" }} />
                  </button>
                </span>
              )}
              {filters.category && (
                <span className="badge rounded-pill d-flex align-items-center gap-1"
                  style={{ background: "#f0f0f0", color: "#1f1f1f", fontWeight: 600, fontSize: "0.78rem", padding: "6px 12px" }}>
                  Category: {filters.category}
                  <button style={{ background: "none", border: "none", padding: 0, marginLeft: 4, cursor: "pointer", color: "#666" }}
                    onClick={() => setFilters((p) => ({ ...p, category: "" }))}>
                    <i className="bi bi-x-lg" style={{ fontSize: "0.7rem" }} />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Product grid */}
          {prodError ? (
            <EmptyState
              icon="bi-exclamation-circle"
              title="Something went wrong"
              desc={prodError}
              action={<button className="btn btn-primary mt-2 rounded-pill px-4" onClick={fetchProducts}>Try Again</button>}
            />
          ) : prodLoading ? (
            <div className="row g-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="col-6 col-md-4 col-lg-3">
                  <ProductSkeleton />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon="bi-bag-x"
              title="No products found"
              desc="Try different search terms or browse all categories."
              action={
                <button className="btn btn-primary mt-2 rounded-pill px-4"
                  onClick={() => { setFilters({ search:"",sortBy:"newest",category:"",rating:"",minPrice:"",maxPrice:""}); setSearchInput(""); }}>
                  Clear Filters
                </button>
              }
            />
          ) : (
            <div className="row g-4">
              {products.map((p) => (
                <div key={p.id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!prodLoading && totalPages > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-5">
              <button
                className="btn btn-sm rounded-circle"
                style={{ width: 40, height: 40, background: currentPage === 1 ? "#f0f0f0" : "var(--primary)", color: currentPage === 1 ? "#bbb" : "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                <i className="bi bi-chevron-left" />
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                const near = Math.abs(page - currentPage) <= 2;
                if (!near && page !== 1 && page !== totalPages) {
                  if (page === currentPage - 3 || page === currentPage + 3)
                    return <span key={page} style={{ lineHeight: "40px", color: "#bbb" }}>…</span>;
                  return null;
                }
                return (
                  <button key={page}
                    className="btn btn-sm rounded-circle"
                    style={{ width: 40, height: 40, border: page === currentPage ? "none" : "1.5px solid #eee", background: page === currentPage ? "var(--primary)" : "transparent", color: page === currentPage ? "#fff" : "#666", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                className="btn btn-sm rounded-circle"
                style={{ width: 40, height: 40, background: currentPage === totalPages ? "#f0f0f0" : "var(--primary)", color: currentPage === totalPages ? "#bbb" : "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          )}

          {/* Load more / See all link */}
          {!prodLoading && products.length > 0 && (
            <div className="text-center mt-4">
              <p style={{ fontSize: "0.82rem", color: "#bbb" }}>
                Showing {products.length} products · Page {currentPage} of {totalPages}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOT DEALS (DYNAMIC FROM API)
      ══════════════════════════════════════════ */}
      <section className="lx-section">
        <div className="container-xl px-3">
          {/* Heading */}
          <div className="d-flex align-items-center justify-content-between mb-5 flex-wrap gap-3">
            <div>
              <span className="section-eyebrow">Limited Time</span>
              <h2 className="section-heading mb-0">Hot Deals</h2>
              <div className="divider-line mt-2" />
            </div>
            <div className="d-flex flex-column align-items-end">
              <span style={{ fontSize: "0.75rem", color: "#999", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>
                Ends in
              </span>
              <CountdownTimer targetHours={5} targetMinutes={30} targetSeconds={0} />
            </div>
          </div>

          {/* Deals Grid */}
          {dealsLoading ? (
            <div className="row g-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-3">
                  <div className="lx-deal-card">
                    <div className="skeleton skeleton-rect" style={{ aspectRatio: "4/3" }} />
                    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                      <div className="skeleton" style={{ height: 14, width: "80%" }} />
                      <div className="skeleton" style={{ height: 20, width: "55%" }} />
                      <div className="skeleton" style={{ height: 36, width: "100%", borderRadius: 12 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : deals.length === 0 ? (
            <EmptyState icon="bi-tags" title="No deals right now" desc="Check back later for exclusive offers." />
          ) : (
            <div className="row g-4">
              {deals.map((product, idx) => {
                const DEAL_DISCOUNTS = [35, 40, 25, 30];
                const discPct = DEAL_DISCOUNTS[idx % DEAL_DISCOUNTS.length];
                const origPrice = Math.round(product.price / (1 - discPct / 100));
                const imageUrl = imgUrl(product.image_url);
                const soldPct = 40 + (idx * 13) % 45;

                return (
                  <div key={product.id} className="col-12 col-sm-6 col-lg-3">
                    <div className="lx-deal-card">
                      {/* Image */}
                      <Link to={`/products/${product.id}`} className="lx-deal-img-wrap d-block" style={{ position: "relative" }}>
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="lx-deal-img"
                          loading="lazy"
                          onError={(e) => { e.target.src = `https://placehold.co/400x300?text=Deal`; }}
                        />
                        <span className="lx-deal-sale-badge">SALE -{discPct}%</span>
                      </Link>

                      {/* Body */}
                      <div className="lx-deal-body">
                        {/* Category */}
                        {product.category && (
                          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: 0.8 }}>
                            {product.category.name}
                          </span>
                        )}

                        {/* Name */}
                        <Link to={`/products/${product.id}`} style={{ textDecoration: "none" }}>
                          <h6 className="lx-product-name" style={{ fontSize: "0.92rem" }}>
                            {product.name}
                          </h6>
                        </Link>

                        {/* Price */}
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "1.05rem", color: "#e53935" }}>
                            Rp {product.price.toLocaleString("id-ID")}
                          </span>
                          <span style={{ fontSize: "0.82rem", color: "#bbb", textDecoration: "line-through" }}>
                            Rp {origPrice.toLocaleString("id-ID")}
                          </span>
                        </div>

                        {/* Stock bar */}
                        <div>
                          <div style={{ fontSize: "0.72rem", color: "#999", marginBottom: 4 }}>
                            <span style={{ color: "#e53935", fontWeight: 600 }}>{soldPct}% sold</span> · Limited stock!
                          </div>
                          <div style={{ height: 5, borderRadius: 99, background: "#f0f0f0", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${soldPct}%`, background: "linear-gradient(90deg,#ff9800,#e53935)", borderRadius: 99, transition: "width 1s ease" }} />
                          </div>
                        </div>

                        {/* Add to cart */}
                        <DealCartButton product={product} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS (Bootstrap Carousel)
      ══════════════════════════════════════════ */}
      <section className="lx-section" style={{ background: "var(--bg-soft)" }}>
        <div className="container-xl px-3">
          <div className="text-center mb-5">
            <span className="section-eyebrow">Reviews</span>
            <h2 className="section-heading">What Our Customers Say</h2>
            <div className="divider-line divider-center mt-2" />
          </div>

          {/* Bootstrap carousel */}
          <div
            id="testimonialCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
            data-bs-interval="5000"
          >
            <div className="carousel-inner">
              {TESTIMONIALS.map((t, i) => (
                <div key={t.id} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                  <div className="lx-testimonial-card">
                    {/* Avatar initials */}
                    <div
                      style={{
                        width: 72, height: 72, borderRadius: "50%",
                        background: `linear-gradient(135deg,${t.color},${t.color}99)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: 800, fontSize: "1.2rem",
                        fontFamily: "'Poppins',sans-serif",
                        margin: "0 auto 16px",
                        boxShadow: `0 8px 24px ${t.color}44`,
                      }}
                    >
                      {t.initials}
                    </div>

                    {/* Stars */}
                    <div className="d-flex justify-content-center gap-1 mb-3">
                      {[...Array(5)].map((_, si) => (
                        <i key={si} className={`bi bi-star${si < t.rating ? "-fill" : ""}`}
                          style={{ color: si < t.rating ? "#f59e0b" : "#e0e0e0", fontSize: "0.9rem" }} />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="lx-testimonial-quote">"{t.quote}"</p>

                    {/* Name */}
                    <div className="lx-testimonial-name">{t.name}</div>
                    <div className="lx-testimonial-role">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button
                className="lx-carousel-btn carousel-control-prev"
                type="button"
                data-bs-target="#testimonialCarousel"
                data-bs-slide="prev"
                style={{ position: "static", width: 44, height: 44, opacity: 1 }}
              >
                <i className="bi bi-chevron-left" style={{ color: "#fff" }} />
              </button>

              {/* Indicators */}
              <div className="d-flex align-items-center gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    data-bs-target="#testimonialCarousel"
                    data-bs-slide-to={i}
                    className={i === 0 ? "active" : ""}
                    style={{
                      width: i === 0 ? 24 : 8, height: 8,
                      borderRadius: 4, background: i === 0 ? "var(--primary)" : "#ddd",
                      border: "none", padding: 0, transition: "all 0.3s",
                    }}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                className="lx-carousel-btn carousel-control-next"
                type="button"
                data-bs-target="#testimonialCarousel"
                data-bs-slide="next"
                style={{ position: "static", width: 44, height: 44, opacity: 1 }}
              >
                <i className="bi bi-chevron-right" style={{ color: "#fff" }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom spacer */}
      <div style={{ height: 24 }} />
    </div>
  );
};

/* ─── DEAL CART BUTTON (separate to avoid closure issues) ─── */
const DealCartButton = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const handleAdd = async () => {
    setLoading(true);
    try {
      await cartApi.addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2200);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="lx-add-cart-btn" onClick={handleAdd} disabled={loading}>
      {loading ? (
        <><span className="spinner-border spinner-border-sm" role="status" /> Adding...</>
      ) : added ? (
        <><i className="bi bi-check-lg" /> Added to Cart!</>
      ) : (
        <><i className="bi bi-bag-plus" /> Add to Cart</>
      )}
    </button>
  );
};

export default HomePage;
