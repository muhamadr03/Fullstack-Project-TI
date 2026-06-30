import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { productApi } from "../../api/productApi";
import { categoryApi } from "../../api/categoryApi";
import ProductGrid from "../../components/ui/ProductGrid";

const SORT_OPTIONS = [
  { label: "Terbaru", value: "newest" },
  { label: "Terlama", value: "oldest" },
  { label: "Harga: Terendah ke Tertinggi", value: "price_asc" },
  { label: "Harga: Tertinggi ke Terendah", value: "price_desc" },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);

  // Get filters from URL
  const searchQuery = searchParams.get("search")?.trim() || "";
  const categoryFilter = searchParams.get("category") || "";
  const sortBy = searchParams.get("sort") || "newest";

  // Local input states for form controls
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(searchQuery);
    setPage(1);
  }, [searchQuery]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await categoryApi.getAllCategories();
        setCategories(Array.isArray(data) ? data : data?.data || []);
      } catch {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { page, limit, sortBy };
        if (categoryFilter) params.category = categoryFilter;
        if (searchQuery) params.search = searchQuery;
        const res = await productApi.getAllProducts(params);
        setProducts(res.data || []);
        setTotalPages(res.pagination?.total_pages || 1);
      } catch {
        setError("Failed to load products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit, sortBy, categoryFilter, searchQuery]);

  // Unified filter handler
  const updateFilters = (newFilters) => {
    const updated = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        updated.set(key, value);
      } else {
        updated.delete(key);
      }
    });

    setSearchParams(updated);
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    updateFilters({
      search: trimmed,
      // Auto-reset category when searching (optional: remove this line to keep category)
      category: "",
    });
  };

  const handleCategoryClick = (slug) => {
    console.log("📋 [Category Filter] Selected slug:", slug);
    updateFilters({
      category: slug || "",
    });
  };

  const handleSortChange = (value) => {
    console.log("📊 [Sort] Selected sort:", value);
    updateFilters({ sort: value });
  };

  const resetFilters = () => {
    console.log("🔄 [Reset] Clearing all filters");
    setSearchParams(new URLSearchParams());
    setSearchInput("");
    setPage(1);
  };

  // Get category name from slug for display
  const getCategoryNameFromSlug = (slug) => {
    if (!slug) return "";
    const category = categories.find((c) => c.slug === slug);
    return category ? category.name : slug;
  };

  return (
    <div className="container-xl px-3 py-5">
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
        <div>
          <span className="section-eyebrow">Katalog</span>
          <h2 className="section-heading">Semua Produk</h2>
          <p className="section-sub">Jelajahi seluruh katalog dengan filter kategori dan pengurutan.</p>
        </div>
        <Link to="/categories" className="btn btn-outline-primary btn-sm px-4">
          Jelajahi Kategori
        </Link>
      </div>

      {/* Filter Feedback & Reset */}
      {(searchQuery || categoryFilter) && (
        <div className="alert alert-info py-3 px-4 mb-4 d-flex justify-content-between align-items-center" style={{ borderRadius: 16 }}>
          <div>
            <strong>Filter Aktif:</strong>
            {searchQuery && <span className="ms-2 badge bg-primary">{`Pencarian: "${searchQuery}"`}</span>}
            {categoryFilter && <span className="ms-2 badge bg-primary">{`Kategori: ${getCategoryNameFromSlug(categoryFilter)}`}</span>}
          </div>
          <button
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={resetFilters}
            title="Hapus semua filter"
          >
            <i className="bi bi-x-circle me-1" /> Hapus
          </button>
        </div>
      )}

      {/* Filter Controls */}
      <div className="card p-4 mb-4" style={{ borderRadius: 20, background: "var(--bg-soft)" }}>
        <div className="row gy-3 gx-3 align-items-center">
          <div className="col-12 col-md-4">
            <form onSubmit={handleSearch} className="d-flex gap-2">
              <input
                type="search"
                className="form-control"
                placeholder="Cari produk..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">Cari</button>
            </form>
          </div>
          <div className="col-12 col-md-4">
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => handleCategoryClick(e.target.value)}
            >
              <option value="">Semua kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug || category.name?.toLowerCase().replace(/\s+/g, "-")}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-4">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="mb-4">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <button
            className={`btn btn-sm ${!categoryFilter ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => handleCategoryClick("")}
          >
            Semua Produk
          </button>
          {categories.map((category) => {
            const slug = category.slug || category.name?.toLowerCase().replace(/\s+/g, "-");
            return (
              <button
                key={category.id}
                className={`btn btn-sm ${categoryFilter === slug ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => handleCategoryClick(slug)}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid or Empty State */}
      {!loading && products.length === 0 ? (
        <div
          className="text-center py-5"
          style={{
            background: "var(--bg-soft)",
            borderRadius: 20,
            padding: "40px 20px",
          }}
        >
          <i className="bi bi-inbox" style={{ fontSize: "3rem", color: "#bbb", marginBottom: 16 }}></i>
          <h5 style={{ color: "#666", marginBottom: 8 }}>Produk Tidak Ditemukan</h5>
          
          {categoryFilter && (
            <div style={{ marginBottom: 20, fontSize: "0.9rem", color: "#999" }}>
              <p>
                Tidak ada produk yang tersedia di kategori <strong>"{getCategoryNameFromSlug(categoryFilter)}"</strong>.
              </p>
              {searchQuery && (
                <p>
                  Coba cari tanpa filter atau jelajahi <Link to="/categories">semua kategori</Link>.
                </p>
              )}
            </div>
          )}

          {searchQuery && !categoryFilter && (
            <p style={{ color: "#999", marginBottom: 20 }}>
              Kami tidak dapat menemukan produk yang sesuai dengan <strong>"{searchQuery}"</strong>.
            </p>
          )}

          {!categoryFilter && !searchQuery && (
            <p style={{ color: "#999", marginBottom: 20 }}>
              Tidak ada produk yang tersedia saat ini. Silakan periksa kembali nanti.
            </p>
          )}

          <div className="d-flex flex-wrap gap-2 justify-content-center">
            <button
              className="btn btn-primary"
              onClick={resetFilters}
            >
              <i className="bi bi-arrow-clockwise me-1" /> Hapus Filter
            </button>
            <Link to="/categories" className="btn btn-outline-primary">
              <i className="bi bi-grid me-1" /> Jelajahi Kategori
            </Link>
          </div>
        </div>
      ) : (
        <ProductGrid
          products={products}
          loading={loading}
          emptyMessage="Memuat produk..."
        />
      )}

      {/* Pagination */}
      {!loading && products.length > 0 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
          <button
            className="btn btn-sm rounded-circle"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            <i className="bi bi-chevron-left" />
          </button>
          <span style={{ fontSize: "0.95rem", color: "#666" }}>
            Halaman {page} dari {totalPages}
          </span>
          <button
            className="btn btn-sm rounded-circle"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
