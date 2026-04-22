import React, { useState, useEffect } from "react";
import { productApi } from "../../api/productApi";
import ProductCard from "../../components/ProductCard"; // Kita comment dulu sampai file-nya dibuat

const HomePage = () => {
  // 1. State untuk Data & Status
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. State untuk Pagination & Search
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState(""); // Teks yang sedang diketik user
  const [searchQuery, setSearchQuery] = useState(""); // Teks yang dikirim ke Backend

  // 3. Fungsi Utama untuk Mengambil Data
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Memanggil fungsi getAllProducts yang sudah Anda buat di productApi.js
      const response = await productApi.getAllProducts({
        page: currentPage,
        limit: 8, // Menampilkan 8 produk per halaman agar grid-nya rapi
        search: searchQuery,
      });

      // Menyimpan data ke State berdasarkan format JSON Backend Anda
      setProducts(response.data);
      setTotalPages(response.pagination.total_pages);
    } catch (err) {
      console.error("Gagal mengambil produk:", err);
      setError(
        "Ups! Gagal memuat daftar produk. Pastikan server Backend menyala.",
      );
    } finally {
      setLoading(false); // Matikan loading spinner setelah selesai (berhasil/gagal)
    }
  };

  // 4. useEffect: Pantau perubahan pada halaman atau kata kunci pencarian
  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery]); // Akan dijalankan ulang HANYA JIKA dua nilai ini berubah

  // 5. Handler untuk Form Pencarian
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Wajib dikembalikan ke halaman 1 jika mencari kata kunci baru
    setSearchQuery(searchInput); // Trigger useEffect
  };

  return (
    <div className="container py-5">
      {/* HEADER & SEARCH BAR */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <h2 className="fw-bold">Katalog Produk</h2>
          <p className="text-muted">Temukan barang impian Anda di sini.</p>
        </div>
        <div className="col-md-6">
          <form onSubmit={handleSearch} className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Cari sepatu, kemeja, dll..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Cari
            </button>
          </form>
        </div>
      </div>

      {/* LOADING, ERROR, ATAU GRID PRODUK */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          Tidak ada produk yang ditemukan untuk pencarian "{searchQuery}".
        </div>
      ) : (
        <>
          {/* GRID PRODUK */}
          <div className="row g-4 mb-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="col-12 col-sm-6 col-md-4 col-lg-3"
              >
                {/* INI KODE BARUNYA */}
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                &laquo; Sebelumnya
              </button>

              <span className="fw-semibold">
                Halaman {currentPage} dari {totalPages}
              </span>

              <button
                className="btn btn-outline-secondary"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
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
