// src/pages/public/HomePage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { productApi }  from "../../api/productApi";
import { categoryApi } from "../../api/categoryApi";
import ProductGrid    from "../../components/ui/ProductGrid";
import CategoryGrid   from "../../components/ui/CategoryGrid";
import BannerCarousel from "../../components/ui/BannerCarousel";
import TeamSection    from "../../components/ui/TeamSection";

/* ─── Feature data ───────────────────────────────────────── */
const FEATURES = [
  {
    icon:  "bi-truck",
    emoji: "🚚",
    title: "Gratis Ongkir",
    desc:  "Gratis ongkir ke seluruh Indonesia untuk setiap pembelian.",
    color: "#FF9800",
  },
  {
    icon:  "bi-shield-check",
    emoji: "🛡️",
    title: "Pembayaran Aman",
    desc:  "100% transaksi terlindungi dengan sistem keamanan terkini.",
    color: "#6366f1",
  },
  {
    icon:  "bi-arrow-counterclockwise",
    emoji: "↩️",
    title: "Garansi Resmi",
    desc:  "Pengembalian produk mudah hingga 30 hari setelah pembelian.",
    color: "#22c55e",
  },
];

/* ─── Why Choose stats ───────────────────────────────────── */
const STATS = [
  { value: "10.000+", label: "Produk",        icon: "bi-box-seam"    },
  { value: "50.000+", label: "Pelanggan",     icon: "bi-people-fill" },
  { value: "150+",    label: "Brand Partner", icon: "bi-award"       },
  { value: "4.9 ★",  label: "Rating",        icon: "bi-star-fill"   },
];

const WHY_HIGHLIGHTS = [
  "Produk 100% Original",
  "Garansi Resmi Terjamin",
  "Pengiriman Super Cepat",
  "Pembayaran 100% Aman",
];

/* ─── Intersection Observer hook ────────────────────────── */
const useFadeIn = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

/* ═══════════════════════════════════════════════════════════
   HomePage
   ═══════════════════════════════════════════════════════════ */
const HomePage = () => {
  const [products,          setProducts]          = useState([]);
  const [loadingProducts,   setLoadingProducts]   = useState(true);
  const [categories,        setCategories]        = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [featureRef,  featureVisible]  = useFadeIn();
  const [whyRef,      whyVisible]      = useFadeIn();
  const [productsRef, productsVisible] = useFadeIn();
  const [catsRef,     catsVisible]     = useFadeIn();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productApi.getAllProducts({ page: 1, limit: 4, sortBy: "popular" });
        setProducts(res.data || []);
      } catch { setProducts([]); }
      finally  { setLoadingProducts(false); }
    };
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAllCategories();
        const list = Array.isArray(data) ? data : data?.data || [];
        setCategories(list.slice(0, 4));
      } catch { setCategories([]); }
      finally  { setLoadingCategories(false); }
    };
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <div style={{ background: "var(--bg)" }}>

      {/* ══════════ HERO BANNER ══════════ */}
      <BannerCarousel />

      {/* ══════════ FEATURE SECTION ══════════ */}
      <section className="hp-feature-section">
        <div className="container-xl px-3">
          <div
            ref={featureRef}
            className={`hp-feature-grid fade-up-group ${featureVisible ? "visible" : ""}`}
          >
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="hp-feature-card"
                style={{ "--delay": `${i * 0.1}s` }}
              >
                <div className="hp-feature-icon-wrap" style={{ "--icon-color": f.color }}>
                  <i className={`bi ${f.icon} hp-feature-icon`} />
                </div>
                <div className="hp-feature-body">
                  <h3 className="hp-feature-title">{f.title}</h3>
                  <p className="hp-feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ WHY CHOOSE SHOPKU ══════════ */}
      <section className="hp-why-section" ref={whyRef}>
        <div className="container-xl px-3">
          <div className={`hp-why-grid fade-up-group ${whyVisible ? "visible" : ""}`}>

            {/* Content */}
            <div className="hp-why-content">
              <span className="hp-why-eyebrow">MENGAPA MEMILIH SHOPKU</span>

              <h2 className="hp-why-title">
                Belanja Lebih Mudah,<br />
                Aman, dan Terpercaya.
              </h2>

              <p className="hp-why-desc">
                ShopKu menghadirkan ribuan produk original dari berbagai brand
                terpercaya dengan harga kompetitif, pengiriman cepat, dan sistem
                pembayaran yang aman.
              </p>
              <p className="hp-why-desc">
                Kami percaya pengalaman berbelanja tidak hanya tentang membeli
                produk, tetapi juga tentang kenyamanan, kepercayaan, dan
                pelayanan terbaik.
              </p>

              {/* Highlights */}
              <div className="hp-why-highlights">
                {WHY_HIGHLIGHTS.map((h) => (
                  <div key={h} className="hp-why-highlight-item">
                    <span className="hp-why-check">
                      <i className="bi bi-check2" />
                    </span>
                    {h}
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="hp-stats-grid">
                {STATS.map((s) => (
                  <div key={s.label} className="hp-stat-card">
                    <i className={`bi ${s.icon} hp-stat-icon`} />
                    <span className="hp-stat-value">{s.value}</span>
                    <span className="hp-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link to="/products" className="hp-why-cta">
                Jelajahi Produk
                <i className="bi bi-arrow-right ms-2" />
              </Link>
            </div>

            {/* Image */}
            <div className="hp-why-img-col">
              <div className="hp-why-img-wrap">
                <img
                  src="/lifestyle_shopku.png"
                  alt="ShopKu — Pengalaman Belanja Modern"
                  className="hp-why-img"
                  loading="lazy"
                />
                {/* Floating badge */}
                <div className="hp-why-float-badge hp-why-badge-tl">
                  <i className="bi bi-patch-check-fill" style={{ color: "#22c55e", fontSize: "1.1rem" }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1f2937" }}>100% Original</div>
                    <div style={{ fontSize: "0.65rem", color: "#6b7280" }}>Produk Bergaransi</div>
                  </div>
                </div>
                <div className="hp-why-float-badge hp-why-badge-br">
                  <i className="bi bi-truck" style={{ color: "var(--primary)", fontSize: "1.1rem" }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1f2937" }}>Gratis Ongkir</div>
                    <div style={{ fontSize: "0.65rem", color: "#6b7280" }}>Seluruh Indonesia</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ POPULAR PRODUCTS ══════════ */}
      <section className="lx-section" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div
          ref={productsRef}
          className={`container-xl px-3 fade-up-group ${productsVisible ? "visible" : ""}`}
        >
          <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
            <div>
              <span className="section-eyebrow">Unggulan</span>
              <h2 className="section-heading">Produk Populer</h2>
              <p className="section-sub" style={{ margin: 0 }}>Temukan produk terlaris pilihan pelanggan kami.</p>
            </div>
            <Link to="/products" className="btn btn-outline-primary btn-sm px-4 fw-semibold flex-shrink-0">
              Lihat Semua <i className="bi bi-arrow-right ms-1" />
            </Link>
          </div>
          <ProductGrid
            products={products}
            loading={loadingProducts}
            limit={4}
            emptyMessage="Belum ada produk unggulan."
          />
        </div>
      </section>

      {/* ══════════ FEATURED CATEGORIES ══════════ */}
      <section className="lx-section" style={{ background: "var(--bg-soft)", paddingTop: 48, paddingBottom: 48 }}>
        <div
          ref={catsRef}
          className={`container-xl px-3 fade-up-group ${catsVisible ? "visible" : ""}`}
        >
          <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
            <div>
              <span className="section-eyebrow">Koleksi</span>
              <h2 className="section-heading">Kategori Pilihan</h2>
              <p className="section-sub" style={{ margin: 0 }}>Jelajahi kategori favorit dan temukan produk yang kamu cari.</p>
            </div>
            <Link to="/categories" className="btn btn-outline-primary btn-sm px-4 fw-semibold flex-shrink-0">
              Semua Kategori <i className="bi bi-arrow-right ms-1" />
            </Link>
          </div>
          <CategoryGrid categories={categories} loading={loadingCategories} limit={4} />
        </div>
      </section>
      {/* ══════════ DEVELOPER TEAM ══════════ */}
      <TeamSection />
    </div>
  );
};

export default HomePage;
