import React, { useState, useEffect } from "react";
import { productApi } from "../../api/productApi";
import { categoryApi } from "../../api/categoryApi";
import ProductCard from "../../components/ui/ProductCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);

  // Search & Filter States (Ditambah Kategori dan Rating)
  const [searchInput, setSearchInput] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "newest",
    category: "", // Tambahan state kategori
    rating: "", // Tambahan state rating
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Pastikan backend API kamu juga menerima parameter category & rating ini
      const response = await productApi.getAllProducts({
        page: currentPage,
        limit: 9, // 3x3 grid
        search: filters.search,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sortBy: filters.sortBy,
        category: filters.category,
        rating: filters.rating,
      });

      setProducts(response.data);
      setTotalPages(response.pagination.total_pages);
    } catch (err) {
      console.error("Gagal mengambil produk:", err);
      setError("Gagal memuat katalog produk.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAllCategories();
      setCategories(data || []);
    } catch (err) {
      console.error("Gagal mengambil kategori:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, filters]);
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleApplyFilter = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, search: searchInput }));
  };

  const handleFilterChange = (key, value) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* =========================================
          NAVBAR DIHILANGKAN SEMENTARA DARI SINI
          (KARENA SUDAH KAMU PISAH DI NavbarCustomer.jsx)
      ========================================= */}

      <div className="container py-5">
        {/* HEADER SECTION */}
        <div className="text-center mb-5 mt-4">
          <h2
            className="fw-bold mb-3"
            style={{
              background: "linear-gradient(90deg, #0b5ed7, #0dcaf0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
              filter: "drop-shadow(0px 2px 2px rgba(13, 110, 253, 0.2))",
            }}
          >
            ✨ Katalog Produk
          </h2>
          <p className="text-secondary fs-5" style={{ fontWeight: "500" }}>
            Temukan barang impian Anda dengan kualitas terbaik.
          </p>
        </div>

        {/* SEARCH BAR - GLASSMORPHISM EFFECT */}
        <div
          className="card border-0 shadow-sm mb-4"
          style={{
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
          }}
        >
          <div className="card-body p-3 p-md-4">
            <form
              onSubmit={handleApplyFilter}
              className="d-flex flex-column flex-md-row gap-3"
            >
              <div className="flex-grow-1">
                <div
                  className="input-group input-group-lg shadow-sm"
                  style={{ borderRadius: "15px", overflow: "hidden" }}
                >
                  <span
                    className="input-group-text border-0 text-primary px-4"
                    style={{ background: "rgba(255, 255, 255, 0.8)" }}
                  >
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none"
                    style={{ background: "rgba(255, 255, 255, 0.8)" }}
                    placeholder="Cari produk impianmu di sini..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary px-4 fw-medium d-none d-md-block"
                  >
                    Cari
                  </button>
                </div>
              </div>

              <button
                type="button"
                className={`btn ${isFilterOpen ? "btn-primary shadow" : "btn-light shadow-sm"} rounded-pill px-4 py-2 py-md-0 d-flex align-items-center justify-content-center gap-2 transition-all`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                title={
                  isFilterOpen
                    ? "Tutup Filter Lanjutan"
                    : "Buka Filter Lanjutan"
                }
                style={{
                  minWidth: "140px",
                  background: isFilterOpen ? "" : "rgba(255, 255, 255, 0.8)",
                  border: isFilterOpen ? "" : "1px solid rgba(255,255,255,0.9)",
                }}
              >
                <i
                  className={`bi bi-funnel${isFilterOpen ? "-fill" : " text-primary"}`}
                ></i>
                <span
                  className={`fw-medium ${isFilterOpen ? "" : "text-primary"}`}
                >
                  {isFilterOpen ? "Tutup Filter" : "Filter"}
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* COLLAPSIBLE ADVANCED FILTER (Diperbarui dengan Kategori & Rating) */}
        <div
          className="card shadow-sm mb-5"
          style={{
            borderRadius: "20px",
            maxHeight: isFilterOpen ? "600px" : "0", // Dinaikkan sedikit agar muat 2 baris
            overflow: "hidden",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            opacity: isFilterOpen ? 1 : 0,
            marginBottom: isFilterOpen ? "30px" : "0",
            background: "rgba(255, 255, 255, 0.45)",
            backdropFilter: "blur(16px)",
            border: isFilterOpen
              ? "1px solid rgba(255, 255, 255, 0.8)"
              : "none",
          }}
        >
          <div
            className="card-body p-4"
            style={{ visibility: isFilterOpen ? "visible" : "hidden" }}
          >
            <form className="row g-4 align-items-end">
              {/* --- BARIS 1 --- */}
              {/* 1. Kategori */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-bold text-dark small mb-2 d-flex align-items-center gap-2">
                  <i className="bi bi-grid text-primary"></i> Kategori
                </label>
                <select
                  className="form-select form-select-lg border-0 shadow-sm"
                  style={{
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    background: "rgba(255, 255, 255, 0.8)",
                  }}
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Rating */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-bold text-dark small mb-2 d-flex align-items-center gap-2">
                  <i className="bi bi-star-fill text-warning"></i> Rating
                  Minimum
                </label>
                <select
                  className="form-select form-select-lg border-0 shadow-sm"
                  style={{
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    background: "rgba(255, 255, 255, 0.8)",
                  }}
                  value={filters.rating}
                  onChange={(e) => handleFilterChange("rating", e.target.value)}
                >
                  <option value="">Semua Rating</option>
                  <option value="4">⭐️ 4 Ke Atas</option>
                  <option value="3">⭐️ 3 Ke Atas</option>
                  <option value="2">⭐️ 2 Ke Atas</option>
                </select>
              </div>

              {/* 3. Urutkan */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-bold text-dark small mb-2 d-flex align-items-center gap-2">
                  <i className="bi bi-sort-down text-primary"></i> Urutkan
                  Berdasarkan
                </label>
                <select
                  className="form-select form-select-lg border-0 shadow-sm"
                  style={{
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    background: "rgba(255, 255, 255, 0.8)",
                  }}
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                >
                  <option value="newest">🌟 Terbaru</option>
                  <option value="price_asc">📉 Harga Terendah</option>
                  <option value="price_desc">📈 Harga Tertinggi</option>
                </select>
              </div>

              {/* --- BARIS 2 --- */}
              {/* 4. Rentang Harga */}
              <div className="col-12 col-md-8">
                <label className="form-label fw-bold text-dark small mb-2 d-flex align-items-center gap-2">
                  <i className="bi bi-tags text-primary"></i> Rentang Harga
                </label>
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="input-group input-group-lg shadow-sm"
                    style={{ borderRadius: "12px", overflow: "hidden" }}
                  >
                    <span
                      className="input-group-text border-0 fs-6"
                      style={{ background: "rgba(240, 244, 248, 0.9)" }}
                    >
                      Rp
                    </span>
                    <input
                      type="number"
                      className="form-control border-0"
                      style={{ background: "rgba(255, 255, 255, 0.8)" }}
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          minPrice: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <span className="text-secondary fw-bold">-</span>
                  <div
                    className="input-group input-group-lg shadow-sm"
                    style={{ borderRadius: "12px", overflow: "hidden" }}
                  >
                    <span
                      className="input-group-text border-0 fs-6"
                      style={{ background: "rgba(240, 244, 248, 0.9)" }}
                    >
                      Rp
                    </span>
                    <input
                      type="number"
                      className="form-control border-0"
                      style={{ background: "rgba(255, 255, 255, 0.8)" }}
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          maxPrice: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* 5. Tombol Aksi */}
              <div className="col-12 col-md-4 d-flex gap-2 justify-content-md-end">
                <button
                  className="btn btn-primary px-4 shadow-sm py-2 fw-medium flex-grow-1 flex-md-grow-0"
                  style={{ borderRadius: "12px", minWidth: "140px" }}
                  type="button"
                  onClick={handleApplyFilter}
                >
                  Terapkan Filter
                </button>
                <button
                  type="button"
                  className="btn shadow-sm text-danger py-2 px-3 bg-white"
                  style={{ borderRadius: "12px", border: "none" }}
                  onClick={() => {
                    setSearchInput("");
                    setFilters({
                      search: "",
                      minPrice: "",
                      maxPrice: "",
                      sortBy: "newest",
                      category: "",
                      rating: "",
                    });
                  }}
                  title="Reset Semua Filter"
                >
                  <i className="bi bi-arrow-counterclockwise fs-5"></i>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* MAIN CONTENT HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary-subtle">
          <h4 className="fw-bold mb-0 text-dark border-start border-4 border-primary ps-3 rounded-1">
            Hasil Pencarian
          </h4>
          <span className="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle rounded-pill px-3 py-2 fw-medium shadow-sm">
            Menampilkan {products.length} produk
          </span>
        </div>

        {/* CONTENT AREA */}
        {loading ? (
          <div className="py-5 text-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchProducts} />
        ) : products.length === 0 ? (
          <div
            className="alert text-center p-5 rounded-4 border-0 shadow-sm"
            style={{
              background: "rgba(255, 255, 255, 0.4)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
            }}
          >
            <div className="mb-4">
              <i
                className="bi bi-search text-primary opacity-50"
                style={{ fontSize: "4rem" }}
              ></i>
            </div>
            <h4 className="fw-bold text-dark">Oops! Produk tidak ditemukan</h4>
            <p className="text-secondary mb-0">
              Coba gunakan kata kunci lain atau ubah rentang harga pada filter.
            </p>
          </div>
        ) : (
          <>
            <div className="row g-4 mb-5">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                >
                  <div
                    className="h-100 transition-hover"
                    style={{ borderRadius: "16px", overflow: "hidden" }}
                  >
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
                <button
                  className="btn btn-primary rounded-circle shadow-sm"
                  style={{
                    width: "45px",
                    height: "45px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>

                <div
                  className="shadow-sm px-4 py-2 rounded-pill fw-bold text-primary"
                  style={{
                    background: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  Halaman {currentPage}{" "}
                  <span className="text-secondary fw-normal mx-1">dari</span>{" "}
                  {totalPages}
                </div>

                <button
                  className="btn btn-primary rounded-circle shadow-sm"
                  style={{
                    width: "45px",
                    height: "45px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
