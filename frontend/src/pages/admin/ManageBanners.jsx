import React, { useState, useEffect } from "react";
import { bannerApi } from "../../api/bannerApi";

const API_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const ManageBannersPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const emptyForm = {
    id: null,
    title: "",
    link_url: "",
    is_active: true,
    image: null,
  };
  const [formData, setFormData] = useState(emptyForm);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await bannerApi.getAllBanners();
      setBanners(data || []);
    } catch (err) {
      console.error("Gagal mengambil banner:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAddClick = () => {
    setFormData(emptyForm);
    setPreviewImage(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditClick = (banner) => {
    setFormData({
      id: banner.id,
      title: banner.title || "",
      link_url: banner.link_url || "",
      is_active: banner.is_active !== undefined ? banner.is_active : true,
      image: null,
    });
    setPreviewImage(
      banner.image_url
        ? banner.image_url.startsWith("http")
          ? banner.image_url
          : `${API_URL}${banner.image_url}`
        : null
    );
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("link_url", formData.link_url);
      data.append("is_active", formData.is_active);
      if (formData.image) data.append("image", formData.image);

      if (isEditing) {
        await bannerApi.updateBanner(formData.id, data);
      } else {
        await bannerApi.createBanner(data);
      }
      setShowForm(false);
      setPreviewImage(null);
      fetchBanners();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan banner.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus banner "${title}"?`)) return;
    try {
      await bannerApi.deleteBanner(id);
      fetchBanners();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus banner.");
    }
  };

  const getBannerImageSrc = (banner) => {
    if (!banner.image_url) return "https://via.placeholder.com/400x150?text=No+Image";
    return banner.image_url.startsWith("http")
      ? banner.image_url
      : `${API_URL}${banner.image_url}`;
  };

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">
          <i className="bi bi-images me-2"></i>Manajemen Banner
        </h2>
        {!showForm && (
          <button onClick={handleAddClick} className="btn btn-primary fw-bold">
            <i className="bi bi-plus-lg me-1"></i> Tambah Banner
          </button>
        )}
      </div>

      {showForm ? (
        /* ── FORM ── */
        <div className="card shadow-sm border-0 mb-5">
          <div className="card-header bg-dark text-white fw-bold">
            {isEditing ? "Edit Banner" : "Tambah Banner Baru"}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3 gy-3">
                {/* Judul */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Judul Banner <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Promo Akhir Tahun"
                    required
                  />
                </div>

                {/* URL Link */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    URL Link (opsional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="link_url"
                    value={formData.link_url}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>

                {/* Gambar */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Gambar Banner{" "}
                    {!isEditing && <span className="text-danger">*</span>}
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!isEditing}
                  />
                  <small className="text-muted">
                    Rekomendasi ukuran: 1200×400px
                  </small>
                </div>

                {/* Preview */}
                {previewImage && (
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Preview</label>
                    <img
                      src={previewImage}
                      alt="Preview Banner"
                      className="img-fluid rounded border"
                      style={{ maxHeight: "150px", objectFit: "cover", width: "100%" }}
                    />
                  </div>
                )}
              </div>

              {/* Aktif */}
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
                <label className="form-check-label fw-semibold" htmlFor="is_active">
                  Aktif (tampilkan di halaman utama)
                </label>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success" disabled={loading}>
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setPreviewImage(null);
                  }}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-images fs-1 d-block mb-2"></i>
              Belum ada banner. Klik "+ Tambah Banner" untuk menambahkan.
            </div>
          ) : (
            /* GRID KARTU BANNER */
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4 mb-4">
              {banners.map((banner) => (
                <div className="col" key={banner.id}>
                  <div className="card h-100 shadow-sm border-0">
                    {/* Gambar banner */}
                    <img
                      src={getBannerImageSrc(banner)}
                      alt={banner.title}
                      className="card-img-top"
                      style={{ height: "140px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x140?text=No+Image";
                      }}
                    />
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className="fw-bold mb-0 text-truncate me-2">
                          {banner.title}
                        </h6>
                        <span
                          className={`badge flex-shrink-0 ${
                            banner.is_active ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {banner.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                      {banner.link_url && (
                        <small className="text-muted d-block text-truncate mb-2">
                          <i className="bi bi-link-45deg me-1"></i>
                          {banner.link_url}
                        </small>
                      )}
                    </div>
                    <div className="card-footer bg-transparent border-top-0 p-3 pt-0 d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary flex-fill"
                        onClick={() => handleEditClick(banner)}
                      >
                        <i className="bi bi-pencil me-1"></i>Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger flex-fill"
                        onClick={() => handleDelete(banner.id, banner.title)}
                      >
                        <i className="bi bi-trash me-1"></i>Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageBannersPage;
