// src/pages/public/HomePage.jsx — Premium Fashion Store
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productApi } from "../../api/productApi";
import { categoryApi } from "../../api/categoryApi";
import ProductGrid from "../../components/ui/ProductGrid";
import CategoryGrid from "../../components/ui/CategoryGrid";
import BannerCarousel from "../../components/ui/BannerCarousel";

const FEATURE_CARDS = [
  { icon: "bi-truck", title: "Free Shipping", desc: "Free delivery on orders above Rp 200.000 within Indonesia." },
  { icon: "bi-shield-lock", title: "Secure Payment", desc: "Bank-grade protection on every purchase." },
  { icon: "bi-arrow-counterclockwise", title: "Easy Returns", desc: "Hassle-free returns within 30 days." },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await productApi.getAllProducts({ page: 1, limit: 4, sortBy: "popular" });
        setProducts(res.data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    const fetchFeaturedCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await categoryApi.getAllCategories();
        const list = Array.isArray(data) ? data : data?.data || [];
        setCategories(list.slice(0, 4));
      } catch {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchFeaturedProducts();
    fetchFeaturedCategories();
  }, []);

  return (
    <div style={{ background: "var(--bg)" }}>

      {/* ── BANNER CAROUSEL ── */}
      <BannerCarousel />

      {/* ── HERO SECTION ── */}
      <section className="lx-section-sm" style={{ paddingTop: 40, paddingBottom: 56 }}>
        <div className="container-xl px-3">
          <div className="row align-items-center gx-5">
            <div className="col-12 col-lg-6">
              <span className="section-eyebrow">New arrivals</span>
              <h1 className="lx-hero-title">
                Discover premium products <br />
                made for everyday style.
              </h1>
              <p className="lx-hero-desc" style={{ maxWidth: 520 }}>
                A quick preview of our top products and highlight categories to help you shop faster.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link to="/products" className="btn btn-primary btn-lg px-5 fw-semibold">
                  View All Products <i className="bi bi-arrow-right ms-1" />
                </Link>
                <Link to="/categories" className="btn btn-outline-primary btn-lg px-5 fw-semibold">
                  View All Categories
                </Link>
              </div>
            </div>

            <div className="col-12 col-lg-6 d-none d-lg-block" style={{ minHeight: 520, position: "relative" }}>
              <img src="/hero_model.png" alt="Hero" className="lx-hero-img" loading="eager" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section className="lx-section-sm" style={{ background: "var(--bg-soft)" }}>
        <div className="container-xl px-3">
          <div className="row g-4">
            {FEATURE_CARDS.map((feature) => (
              <div key={feature.title} className="col-12 col-sm-6 col-xl-4">
                <div className="lx-feature-card h-100">
                  <div className="lx-feature-icon">
                    <i className={`bi ${feature.icon}`} />
                  </div>
                  <h6 className="lx-feature-title">{feature.title}</h6>
                  <p className="lx-feature-desc">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR PRODUCTS ── */}
      <section className="lx-section" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div className="container-xl px-3">
          <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
            <div>
              <span className="section-eyebrow">Featured</span>
              <h2 className="section-heading">Popular products</h2>
              <p className="section-sub">A short preview of trending items from our catalog.</p>
            </div>
            <Link to="/products" className="btn btn-outline-primary btn-sm px-4">
              View All Products
            </Link>
          </div>

          <ProductGrid products={products} loading={loadingProducts} limit={4} emptyMessage="No featured products available." />
        </div>
      </section>

      {/* ── FEATURED CATEGORIES ── */}
      <section className="lx-section" style={{ background: "var(--bg-soft)", paddingTop: 40, paddingBottom: 40 }}>
        <div className="container-xl px-3">
          <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
            <div>
              <span className="section-eyebrow">Collections</span>
              <h2 className="section-heading">Featured categories</h2>
              <p className="section-sub">Browse a few highlight categories to get started quickly.</p>
            </div>
            <Link to="/categories" className="btn btn-outline-primary btn-sm px-4">
              View All Categories
            </Link>
          </div>

          <CategoryGrid categories={categories} loading={loadingCategories} limit={4} />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
