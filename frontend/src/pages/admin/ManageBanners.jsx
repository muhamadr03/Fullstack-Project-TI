// src/pages/admin/ManageBanners.jsx
import React, { useState, useEffect, useRef } from "react";
import { bannerApi } from "../../api/bannerApi";

const API_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const ManageBannersPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const emptyForm = {
    id: null,
    title: "",
    link_url: "",
    is_active: true,
    image: null,
  };
  const [formData, setFormData] = useState(emptyForm);
  const [previewImage, setPreviewImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await bannerApi.getAllBanners();
      const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      setBanners(list);
    } catch (err) {
      console.error("Gagal mengambil banner:", err);
      showToast("Gagal memuat banner.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("File harus berupa gambar.", "error");
      return;
    }
    setFormData((prev) => ({ ...prev, image: file }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleAddClick = () => {
    setFormData(emptyForm);
    setPreviewImage(null);
    setIsEditing(false);
    setShowForm(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEditClick = (banner) => {
    setFormData({
      id: banner.id,
      title: banner.title || "",
      link_url: banner.link_url || "",
      is_active: banner.is_active !== undefined ? banner.is_active : true,
      image: null,
    });
    setPreviewImage(getBannerImageSrc(banner) || null);
    setIsEditing(true);
    setShowForm(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancel = () => {
    setShowForm(false);
    setPreviewImage(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing && !formData.image) {
      showToast("Pilih gambar banner terlebih dahulu.", "error");
      return;
    }
    setSaving(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("link_url", formData.link_url);
      data.append("is_active", formData.is_active);
      if (formData.image) data.append("image", formData.image);

      if (isEditing) {
        await bannerApi.updateBanner(formData.id, data);
        showToast("Banner berhasil diperbarui!");
      } else {
        await bannerApi.createBanner(data);
        showToast("Banner berhasil ditambahkan!");
      }
      setShowForm(false);
      setPreviewImage(null);
      fetchBanners();
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal menyimpan banner.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus banner "${title}"?`)) return;
    try {
      await bannerApi.deleteBanner(id);
      showToast("Banner berhasil dihapus!");
      fetchBanners();
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal menghapus banner.", "error");
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      const data = new FormData();
      data.append("title", banner.title);
      data.append("link_url", banner.link_url || "");
      data.append("is_active", !banner.is_active);
      await bannerApi.updateBanner(banner.id, data);
      showToast(
        !banner.is_active
          ? "Banner diaktifkan!"
          : "Banner dinonaktifkan."
      );
      fetchBanners();
    } catch {
      showToast("Gagal mengubah status banner.", "error");
    }
  };

  const getBannerImageSrc = (banner) => {
    if (!banner?.image_url) return null;
    return banner.image_url.startsWith("http")
      ? banner.image_url
      : `${API_URL}${banner.image_url}`;
  };

  const activeBanners = banners.filter((b) => b.is_active);
  const inactiveBanners = banners.filter((b) => !b.is_active);

  return (
    <div style={{ position: "relative", minHeight: 400 }}>

      {/* ── TOAST NOTIFICATION ── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 9999,
            background: toast.type === "error" ? "#ef4444" : "#22c55e",
            color: "#fff",
            borderRadius: 12,
            padding: "12px 20px",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            fontSize: "0.88rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            animation: "slideInToast 0.3s ease both",
          }}
        >
          <i className={`bi ${toast.type === "error" ? "bi-x-circle" : "bi-check-circle"}`} />
          {toast.message}
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0" style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.4rem" }}>
            <i className="bi bi-images me-2" style={{ color: "var(--primary)" }} />
            Manajemen Banner
          </h2>
          <p className="text-muted mb-0 mt-1" style={{ fontSize: "0.83rem" }}>
            Kelola banner carousel yang tampil di halaman utama
          </p>
        </div>
        {!showForm && (
          <button onClick={handleAddClick} className="btn btn-primary fw-bold" style={{ gap: 6 }}>
            <i className="bi bi-plus-lg me-1" /> Tambah Banner
          </button>
        )}
      </div>

      {/* ── STATS ROW ── */}
      {!showForm && (
        <div className="row g-3 mb-4">
          {[
            { label: "Total Banner", value: banners.length, icon: "bi-images", color: "#6366f1" },
            { label: "Aktif", value: activeBanners.length, icon: "bi-check-circle-fill", color: "#22c55e" },
            { label: "Nonaktif", value: inactiveBanners.length, icon: "bi-dash-circle", color: "#94a3b8" },
          ].map((s) => (
            <div key={s.label} className="col-4">
              <div
                className="d-flex align-items-center gap-3 p-3"
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  border: "1px solid #eee",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: s.color + "18",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                    color: s.color,
                    flexShrink: 0,
                  }}
                >
                  <i className={`bi ${s.icon}`} />
                </div>
                <div>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "1.3rem", lineHeight: 1 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#888", marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        /* ── FORM ADD/EDIT ── */
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            border: "1px solid #eee",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
            overflow: "hidden",
            marginBottom: 32,
          }}
        >
          {/* Form header */}
          <div
            style={{
              background: isEditing
                ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                : "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
              padding: "18px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <i
                className={`bi ${isEditing ? "bi-pencil-square" : "bi-plus-square"}`}
                style={{ color: "#fff", fontSize: "1.2rem" }}
              />
              <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#fff", fontSize: "1rem" }}>
                {isEditing ? "Edit Banner" : "Tambah Banner Baru"}
              </span>
            </div>
            <button
              style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, color: "#fff", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              onClick={handleCancel}
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: "28px" }}>
            <div className="row gy-4">
              {/* Judul Banner */}
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>
                  Judul Banner <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Contoh: Promo Akhir Tahun"
                  required
                  style={{ borderRadius: 10, fontSize: "0.88rem", padding: "10px 14px" }}
                />
              </div>

              {/* URL Link */}
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>
                  URL Link <span className="text-muted fw-normal">(opsional)</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text" style={{ borderRadius: "10px 0 0 10px", background: "#f8f9fa" }}>
                    <i className="bi bi-link-45deg text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    name="link_url"
                    value={formData.link_url}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    style={{ borderRadius: "0 10px 10px 0", fontSize: "0.88rem" }}
                  />
                </div>
                <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                  Banner akan bisa diklik dan menuju URL ini
                </small>
              </div>

              {/* Drag & Drop Upload */}
              <div className="col-12">
                <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>
                  Gambar Banner {!isEditing && <span className="text-danger">*</span>}
                  {isEditing && <span className="text-muted fw-normal"> (kosongkan jika tidak ingin ganti)</span>}
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragOver ? "var(--primary)" : "#ddd"}`,
                    borderRadius: 14,
                    padding: previewImage ? "0" : "40px 20px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: dragOver ? "var(--primary-light)" : "#fafafa",
                    transition: "all 0.2s ease",
                    overflow: "hidden",
                    minHeight: previewImage ? 200 : "auto",
                    position: "relative",
                  }}
                >
                  {previewImage ? (
                    <>
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(0,0,0,0.45)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          opacity: 0,
                          transition: "opacity 0.2s",
                        }}
                        className="banner-preview-hover"
                        onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
                        onMouseOut={(e) => (e.currentTarget.style.opacity = 0)}
                      >
                        <i className="bi bi-camera-fill" style={{ color: "#fff", fontSize: "1.5rem" }} />
                        <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.85rem" }}>Ganti Gambar</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-upload" style={{ fontSize: "2.5rem", color: "#ccc", display: "block", marginBottom: 12 }} />
                      <div style={{ fontWeight: 600, color: "#666", marginBottom: 4, fontSize: "0.88rem" }}>
                        Drag & drop gambar di sini, atau klik untuk memilih
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#aaa" }}>
                        Rekomendasi: 1200×400px, maks 5MB (JPG, PNG, WebP)
                      </div>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>

              {/* Status Aktif */}
              <div className="col-12">
                <div
                  style={{
                    background: formData.is_active ? "#f0fdf4" : "#f8f9fa",
                    border: `1.5px solid ${formData.is_active ? "#bbf7d0" : "#e2e8f0"}`,
                    borderRadius: 12,
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                  onClick={() => setFormData((p) => ({ ...p, is_active: !p.is_active }))}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <i
                      className={`bi ${formData.is_active ? "bi-eye-fill" : "bi-eye-slash"}`}
                      style={{ color: formData.is_active ? "#22c55e" : "#94a3b8", fontSize: "1.1rem" }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.88rem", color: formData.is_active ? "#16a34a" : "#64748b" }}>
                        {formData.is_active ? "Banner Aktif" : "Banner Nonaktif"}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#888" }}>
                        {formData.is_active
                          ? "Banner akan ditampilkan di carousel halaman utama"
                          : "Banner tidak akan tampil di halaman utama"}
                      </div>
                    </div>
                  </div>
                  {/* Toggle switch */}
                  <div
                    style={{
                      width: 46,
                      height: 26,
                      borderRadius: 13,
                      background: formData.is_active ? "#22c55e" : "#cbd5e1",
                      position: "relative",
                      flexShrink: 0,
                      transition: "background 0.2s",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 3,
                        left: formData.is_active ? 23 : 3,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "#fff",
                        transition: "left 0.2s",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3 mt-4">
              <button type="submit" className="btn btn-primary fw-bold px-5" disabled={saving}>
                {saving ? (
                  <><span className="spinner-border spinner-border-sm me-2" /> Menyimpan...</>
                ) : (
                  <><i className="bi bi-check-lg me-2" />{isEditing ? "Simpan Perubahan" : "Tambah Banner"}</>
                )}
              </button>
              <button type="button" className="btn btn-outline-secondary fw-semibold" onClick={handleCancel}>
                <i className="bi bi-x-lg me-2" />Batal
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* ── BANNER LIST ── */
        <>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: "var(--primary)" }} role="status" />
              <p className="text-muted mt-3" style={{ fontSize: "0.88rem" }}>Memuat banner...</p>
            </div>
          ) : banners.length === 0 ? (
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                border: "1px solid #eee",
                padding: "60px 32px",
                textAlign: "center",
              }}
            >
              <i className="bi bi-images" style={{ fontSize: "3rem", color: "#ddd", display: "block", marginBottom: 16 }} />
              <h5 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#888" }}>
                Belum ada banner
              </h5>
              <p className="text-muted" style={{ fontSize: "0.85rem", marginBottom: 20 }}>
                Klik tombol "Tambah Banner" untuk menambahkan banner pertama Anda.
              </p>
              <button onClick={handleAddClick} className="btn btn-primary">
                <i className="bi bi-plus-lg me-2" /> Tambah Banner
              </button>
            </div>
          ) : (
            <>
              {/* Preview Carousel Mini */}
              {activeBanners.length > 0 && (
                <div
                  style={{
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 24,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <i className="bi bi-play-circle-fill" style={{ color: "var(--primary)" }} />
                    <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.85rem", fontFamily: "Poppins, sans-serif" }}>
                      Preview Carousel ({activeBanners.length} banner aktif)
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                    {activeBanners.map((b, idx) => (
                      <div
                        key={b.id}
                        style={{ position: "relative", flexShrink: 0, width: 160, height: 70, borderRadius: 8, overflow: "hidden", border: "2px solid rgba(255,152,0,0.4)" }}
                      >
                        <img
                          src={getBannerImageSrc(b) || ""}
                          alt={b.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { e.target.src = "https://placehold.co/160x70/374151/9ca3af?text=No+Image"; }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0,0,0,0.35)",
                            display: "flex",
                            alignItems: "flex-end",
                            padding: "4px 6px",
                          }}
                        >
                          <span style={{ color: "#fff", fontSize: "0.65rem", fontWeight: 600 }}>#{idx + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Banner Grid */}
              <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 mb-4">
                {banners.map((banner) => {
                  const imgSrc = getBannerImageSrc(banner);
                  return (
                    <div className="col" key={banner.id}>
                      <div
                        style={{
                          background: "#fff",
                          borderRadius: 16,
                          border: `1.5px solid ${banner.is_active ? "#bbf7d0" : "#e2e8f0"}`,
                          overflow: "hidden",
                          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                          transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}
                      >
                        {/* Banner image */}
                        <div style={{ position: "relative", height: 160, background: "#f1f5f9", overflow: "hidden" }}>
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={banner.title}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => { e.target.src = "https://placehold.co/400x160/e2e8f0/94a3b8?text=No+Image"; }}
                            />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <i className="bi bi-image" style={{ fontSize: "2.5rem", color: "#ccc" }} />
                            </div>
                          )}
                          {/* Status badge */}
                          <span
                            style={{
                              position: "absolute",
                              top: 10,
                              left: 10,
                              background: banner.is_active ? "#22c55e" : "#64748b",
                              color: "#fff",
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              padding: "3px 10px",
                              borderRadius: 20,
                              fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            {banner.is_active ? "● Aktif" : "● Nonaktif"}
                          </span>
                        </div>

                        {/* Card body */}
                        <div style={{ padding: "14px 16px" }}>
                          <h6 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "0.92rem", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {banner.title}
                          </h6>
                          {banner.link_url && (
                            <div style={{ fontSize: "0.75rem", color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>
                              <i className="bi bi-link-45deg me-1" style={{ color: "var(--primary)" }} />
                              {banner.link_url}
                            </div>
                          )}
                        </div>

                        {/* Card actions */}
                        <div
                          style={{
                            padding: "10px 16px 14px",
                            display: "flex",
                            gap: 8,
                            borderTop: "1px solid #f1f5f9",
                          }}
                        >
                          {/* Toggle active */}
                          <button
                            onClick={() => handleToggleActive(banner)}
                            style={{
                              flex: 1,
                              background: banner.is_active ? "#fef2f2" : "#f0fdf4",
                              color: banner.is_active ? "#ef4444" : "#16a34a",
                              border: `1px solid ${banner.is_active ? "#fecaca" : "#bbf7d0"}`,
                              borderRadius: 8,
                              padding: "7px 0",
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              fontFamily: "Poppins, sans-serif",
                              transition: "all 0.15s",
                            }}
                          >
                            <i className={`bi ${banner.is_active ? "bi-eye-slash" : "bi-eye-fill"} me-1`} />
                            {banner.is_active ? "Nonaktifkan" : "Aktifkan"}
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleEditClick(banner)}
                            style={{
                              flex: 1,
                              background: "#eff6ff",
                              color: "#2563eb",
                              border: "1px solid #bfdbfe",
                              borderRadius: 8,
                              padding: "7px 0",
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              fontFamily: "Poppins, sans-serif",
                              transition: "all 0.15s",
                            }}
                          >
                            <i className="bi bi-pencil me-1" />
                            Edit
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(banner.id, banner.title)}
                            style={{
                              width: 36,
                              background: "#fff",
                              color: "#94a3b8",
                              border: "1px solid #e2e8f0",
                              borderRadius: 8,
                              padding: "7px 0",
                              fontSize: "0.85rem",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.15s",
                              flexShrink: 0,
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "#fecaca"; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
                          >
                            <i className="bi bi-trash3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ManageBannersPage;
