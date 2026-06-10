import React, { useState, useEffect } from "react";
import { categoryApi } from "../../api/categoryApi";

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ id: null, name: "", slug: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddClick = () => {
    setFormData({ id: null, name: "", slug: "" });
    setIsEditing(false);
  };

  const handleEditClick = (category) => {
    setFormData({
      id: category.id,
      name: category.name || "",
      slug: category.slug || "",
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
      };

      if (isEditing) {
        await categoryApi.updateCategory(formData.id, payload);
        alert("Kategori berhasil diperbarui.");
      } else {
        await categoryApi.createCategory(payload);
        alert("Kategori berhasil ditambahkan.");
      }

      setFormData({ id: null, name: "", slug: "" });
      setIsEditing(false);
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
    if (!window.confirm(`Hapus kategori \"${category.name}\"?`)) return;

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

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">
            <i className="bi bi-tags me-2"></i>Kelola Kategori
          </h2>
          <p className="text-muted mb-0">
            Tambahkan, edit, dan hapus kategori produk.
          </p>
        </div>
        <button onClick={handleAddClick} className="btn btn-primary fw-bold">
          <i className="bi bi-plus-lg me-1"></i> Tambah Kategori
        </button>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-dark text-white fw-bold">
          {isEditing ? "Edit Kategori" : "Kategori Baru"}
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row gy-3">
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
              <div className="col-12 d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  {isEditing ? "Perbarui Kategori" : "Simpan Kategori"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ id: null, name: "", slug: "" });
                      setError(null);
                    }}
                  >
                    Batal
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h5 className="mb-0">Daftar Kategori</h5>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Cari kategori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

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
                <thead className="table-dark">
                  <tr>
                    <th>Nama Kategori</th>
                    <th>Slug</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-muted">
                        Tidak ada kategori.
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((category) => (
                      <tr key={category.id}>
                        <td>{category.name}</td>
                        <td>{category.slug}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEditClick(category)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(category)}
                          >
                            Hapus
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
    </div>
  );
};

export default ManageCategoriesPage;
