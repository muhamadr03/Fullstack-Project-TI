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
      <div className="row g-4">
        {/* SIDEBAR FILTER */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: "80px", zIndex: 1 }}>
            <div className="card-body">
              <h5 className="fw-bold mb-4">Filter Produk</h5>
              
              <form onSubmit={handleApplyFilter} className="mb-4">
                <label className="form-label fw-semibold text-muted small">Pencarian</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cari..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button className="btn btn-primary" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>

              <div className="mb-4">
                <label className="form-label fw-semibold text-muted small">Urutkan</label>
                <select 
                  className="form-select" 
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                >
                  <option value="newest">Terbaru</option>
                  <option value="price_asc">Harga Terendah</option>
                  <option value="price_desc">Harga Tertinggi</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-muted small">Rentang Harga</label>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <input 
                    type="number" 
                    className="form-control form-control-sm" 
                    placeholder="Min" 
                    value={filters.minPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  />
                  <span>-</span>
                  <input 
                    type="number" 
                    className="form-control form-control-sm" 
                    placeholder="Max" 
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  />
                </div>
                <button 
                  className="btn btn-outline-primary btn-sm w-100"
                  onClick={() => handleFilterChange("minPrice", filters.minPrice)} // trigger effect
                >
                  Terapkan Harga
                </button>
              </div>
              
              <button 
                className="btn btn-light w-100 text-muted"
                onClick={() => {
                  setSearchInput("");
                  setFilters({ search: "", minPrice: "", maxPrice: "", sortBy: "newest" });
                }}
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="fw-bold mb-1">Katalog Produk</h2>
              <p className="text-muted mb-0">Temukan barang impian Anda di sini.</p>
            </div>
            <div className="text-muted small">
              Menampilkan {products.length} produk
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchProducts} />
          ) : products.length === 0 ? (
            <div className="alert alert-info text-center p-5 rounded-4 bg-white border">
              <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
              <h5 className="fw-bold">Tidak ada produk</h5>
              <p className="text-muted mb-0">Coba gunakan kata kunci atau rentang harga lain.</p>
            </div>
          ) : (
            <>
              <div className="row g-4 mb-5">
                {products.map((product) => (
                  <div key={product.id} className="col-12 col-sm-6 col-md-4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-3">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    &laquo; Sebelumnya
                  </button>
                  <span className="fw-semibold text-muted small">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
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
      </div>
    </div>
  );
};

export default HomePage;
