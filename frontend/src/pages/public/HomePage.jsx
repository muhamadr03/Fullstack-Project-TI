import React, { useState, useEffect } from "react";
import { productApi } from "../../api/productApi";
import ProductCard from "../../components/ui/ProductCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Search & Filter States
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "newest"
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productApi.getAllProducts({
        page: currentPage,
        limit: 9, // 3x3 grid looks good
        search: filters.search,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sortBy: filters.sortBy
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

  useEffect(() => {
    fetchProducts();
  }, [currentPage, filters]);

  const handleApplyFilter = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setFilters(prev => ({ ...prev, search: searchInput }));
  };

  const handleFilterChange = (key, value) => {
    setCurrentPage(1);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container py-5">
      {/* HEADER SECTION */}
      <div className="text-center mb-5">
        <h2 className="fw-bold mb-2">Katalog Produk</h2>
        <p className="text-muted">Temukan barang impian Anda dengan kualitas terbaik.</p>
      </div>

      {/* HORIZONTAL FILTER BAR */}
      <div className="card border-0 shadow-sm mb-5 glass-panel" style={{ borderRadius: "16px" }}>
        <div className="card-body p-4">
          <form onSubmit={handleApplyFilter} className="row g-3 align-items-end">
            {/* Pencarian */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold text-muted small mb-1">Pencarian</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0 text-muted px-3" style={{ borderRadius: "10px 0 0 10px" }}>
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0 shadow-none"
                  style={{ borderRadius: "0 10px 10px 0" }}
                  placeholder="Cari produk..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>

            {/* Urutkan */}
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold text-muted small mb-1">Urutkan</label>
              <select 
                className="form-select bg-light border-0 shadow-none" 
                style={{ borderRadius: "10px" }}
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              >
                <option value="newest">Terbaru</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
              </select>
            </div>

            {/* Rentang Harga */}
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold text-muted small mb-1">Rentang Harga</label>
              <div className="d-flex align-items-center gap-2">
                <input 
                  type="number" 
                  className="form-control bg-light border-0 shadow-none" 
                  style={{ borderRadius: "10px" }}
                  placeholder="Min" 
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                />
                <span className="text-muted">-</span>
                <input 
                  type="number" 
                  className="form-control bg-light border-0 shadow-none" 
                  style={{ borderRadius: "10px" }}
                  placeholder="Max" 
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                />
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="col-12 col-md-2 d-flex gap-2">
              <button 
                className="btn btn-primary flex-grow-1 shadow-sm" 
                style={{ borderRadius: "10px" }}
                type="submit"
              >
                Terapkan
              </button>
              <button 
                type="button"
                className="btn btn-light shadow-sm text-muted"
                style={{ borderRadius: "10px" }}
                onClick={() => {
                  setSearchInput("");
                  setFilters({ search: "", minPrice: "", maxPrice: "", sortBy: "newest" });
                }}
                title="Reset Filter"
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Hasil Pencarian</h5>
        <div className="text-muted small px-3 py-1 bg-light rounded-pill">
          Menampilkan {products.length} produk
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchProducts} />
      ) : products.length === 0 ? (
        <div className="alert alert-info text-center p-5 rounded-4 bg-white border border-light shadow-sm">
          <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
          <h5 className="fw-bold">Tidak ada produk</h5>
          <p className="text-muted mb-0">Coba gunakan kata kunci atau rentang harga lain.</p>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-5">
            {products.map((product) => (
              <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
              <button
                className="btn btn-outline-secondary btn-sm px-3 rounded-pill"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                &laquo; Sebelumnya
              </button>
              <span className="fw-semibold text-muted small bg-light px-3 py-1 rounded-pill">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                className="btn btn-outline-secondary btn-sm px-3 rounded-pill"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Selanjutnya &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
