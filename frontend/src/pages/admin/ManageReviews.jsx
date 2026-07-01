import React, { useState, useEffect } from "react";
import { reviewAdminApi } from "../../api/reviewAdminApi";
import { categoryApi } from "../../api/categoryApi";
import * as XLSX from "xlsx";
import toast from 'react-hot-toast';

const ManageReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchReviews();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAllCategories();
      setCategories(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error("Gagal memuat kategori:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reviewAdminApi.getAllReviews();
      setReviews(data || []);
    } catch (err) {
      console.error("Gagal memuat ulasan:", err);
      setError("Gagal mengambil data ulasan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus ulasan ini? Tindakan tidak dapat dibatalkan.")) return;
    try {
      await reviewAdminApi.deleteReview(id);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus ulasan.");
    }
  };

  // Render bintang
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`bi ${i < rating ? "bi-star-fill text-warning" : "bi-star text-muted"}`}
      ></i>
    ));
  };

  // Filter & search
  const filteredReviews = reviews.filter((r) => {
    const searchLower = searchTerm.toLowerCase();
    const matchSearch =
      r.user?.name?.toLowerCase().includes(searchLower) ||
      r.comment?.toLowerCase().includes(searchLower);
    const matchRating = filterRating ? r.rating === parseInt(filterRating, 10) : true;
    const matchCategory = filterCategory ? r.product?.category_id === parseInt(filterCategory, 10) : true;
    return matchSearch && matchRating && matchCategory;
  });

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirst, indexOfLast);

  const paginate = (page) => setCurrentPage(page);

  const handleExportExcel = () => {
    const dataToExport = filteredReviews.map((r) => ({
      "Review ID": r.id,
      "Product ID": r.product_id,
      "Product Name": r.product?.name || "-",
      "Category": r.product?.category?.name || "-",
      "Reviewer Name": r.user?.name || "Anonim",
      "Reviewer Email": r.user?.email || "-",
      "Rating": r.rating,
      "Comment": r.comment || "-",
      "Date": r.created_at ? new Date(r.created_at).toLocaleDateString("id-ID") : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ulasan");
    XLSX.writeFile(workbook, "Data_Ulasan.xlsx");
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">
          <i className="bi bi-chat-square-text-fill me-2"></i>Moderasi Ulasan
        </h2>
        <div className="d-flex gap-2">
          <button onClick={handleExportExcel} className="btn btn-success btn-sm">
            <i className="bi bi-file-earmark-excel me-1"></i>Export Excel
          </button>
          <button onClick={fetchReviews} className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-clockwise me-1"></i>Refresh Data
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* FILTER & PENCARIAN */}
      <div className="row mb-3 gy-2">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Cari nama reviewer atau komentar..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={filterRating}
            onChange={(e) => {
              setFilterRating(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Semua Rating</option>
            <option value="5">5 Bintang</option>
            <option value="4">4 Bintang</option>
            <option value="3">3 Bintang</option>
            <option value="2">2 Bintang</option>
            <option value="1">1 Bintang</option>
          </select>
        </div>
        <div className="col-md-3 text-end text-muted small d-flex align-items-center justify-content-end">
          {filteredReviews.length} ulasan ditemukan
        </div>
      </div>

      {/* TABEL ULASAN */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="ps-3">Produk / Kategori</th>
                  <th>Reviewer</th>
                  <th>Rating</th>
                  <th>Komentar</th>
                  <th>Tanggal</th>
                  <th className="text-center pe-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentReviews.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      Ulasan tidak ditemukan.
                    </td>
                  </tr>
                ) : (
                  currentReviews.map((review) => (
                    <tr key={review.id}>
                      <td className="ps-3">
                        <div className="fw-bold text-truncate" style={{ maxWidth: "150px" }} title={review.product?.name}>
                          {review.product?.name || `Produk #${review.product_id}`}
                        </div>
                        <small className="text-muted">{review.product?.category?.name || "Tanpa Kategori"}</small>
                      </td>
                      <td>
                        <div className="fw-bold">{review.user?.name || "Anonim"}</div>
                        {review.user?.email && (
                          <small className="text-muted">{review.user.email}</small>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <small className="text-muted">{review.rating}/5</small>
                      </td>
                      <td style={{ maxWidth: "260px" }}>
                        <span
                          className="d-inline-block text-truncate"
                          style={{ maxWidth: "240px" }}
                          title={review.comment}
                        >
                          {review.comment || <span className="text-muted">-</span>}
                        </span>
                      </td>
                      <td>
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      <td className="pe-3 text-center">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(review.id)}
                          title="Hapus Ulasan"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* PAGINASI */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
              >
                Sebelumnya
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => paginate(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
              >
                Selanjutnya
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ManageReviewsPage;
