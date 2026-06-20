import React, { useState, useEffect } from "react";
import { categoryApi } from "../../api/categoryApi";

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ==========================================
  // STATE PENCARIAN & PAGINASI
  // ==========================================
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({ id: null, name: "", slug: "", image: null });

  const API_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:5000";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await categoryApi.getAllCategories();
      setCategories(response || []);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat daftar kategori.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOGIKA FILTER & PAGINASI
  // ==========================================
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle Form Actions
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleAddClick = () => {
    setFormData({ id: null, name: "", slug: "", image: null });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditClick = (category) => {
    setFormData({
      id: category.id,
      name: category.name || "",
      slug: category.slug || "",
      image: null,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("slug", formData.slug);
      if (formData.image) {
        payload.append("image", formData.image);
      }

      if (isEditing) {
        await categoryApi.updateCategory(formData.id, payload);
      } else {
        await categoryApi.createCategory(payload);
      }

      setShowForm(false);
      fetchCategories();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Terjadi kesalahan saat menyimpan kategori.";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Hapus kategori "${category.name}"?`)) return;

    try {
      setLoading(true);
      await categoryApi.deleteCategory(category.id);
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menghapus kategori.";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">
          <i className="bi bi-tags me-2"></i>Kelola Kategori
        </h2>
        {!showForm && (
          <button onClick={handleAddClick} className="btn btn-primary fw-bold">
            <i className="bi bi-plus-lg me-1"></i> Tambah Kategori
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm ? (
        <div className="card shadow-sm border-0 mb-5">
          <div className="card-header bg-dark text-white fw-bold">
            {isEditing ? "Edit Kategori" : "Form Kategori Baru"}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Nama Kategori</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Slug Kategori</label>
                  <input
                    type="text"
                    className="form-control"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="Contoh: elektronik"
                  />
                  <div className="form-text">
                    Jika dikosongkan, slug akan dibuat dari nama secara otomatis.
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Gambar Kategori</label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <button type="submit" className="btn btn-success me-2">
                {loading ? "Proses..." : "Simpan"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setError(null);
                }}
              >
                Batal
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* SEARCH BAR */}
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari kategori..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* TABEL KATEGORI */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-3">Gambar</th>
                        <th>Nama Kategori</th>
                        <th>Slug</th>
                        <th className="text-center pe-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCategories.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-4 text-muted">
                            Tidak ada kategori.
                          </td>
                        </tr>
                      ) : (
                        currentCategories.map((category) => (
                          <tr key={category.id}>
                            <td className="ps-3">
                              {category.image_url ? (
                                <img
                                  src={category.image_url.startsWith('http') ? category.image_url : `${API_URL}${category.image_url}`}
                                  alt={category.name}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                  }}
                                  onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/50";
                                  }}
                                />
                              ) : (
                                <div style={{ width: "50px", height: "50px", backgroundColor: "#e9ecef", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <i className="bi bi-image text-muted"></i>
                                </div>
                              )}
                            </td>
                            <td className="fw-bold">{category.name}</td>
                            <td>{category.slug}</td>
                            <td className="text-center pe-3">
                              <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => handleEditClick(category)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(category)}
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
              )}
            </div>
          </div>

          {/* PAGINASI */}
          {totalPages > 1 && (
            <nav className="d-flex justify-content-center">
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                  >
                    Prev
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(i + 1)}
                    >
                      {i + 1}
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
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default ManageCategoriesPage;
