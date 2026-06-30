// src/pages/admin/ManageBanners.jsx — v2 with rich banner fields
import React, { useState, useEffect, useRef } from "react";
import { bannerApi } from "../../api/bannerApi";

const API_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const resolveUrl = (url) => {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_URL}${url}`;
};

const EMPTY_FORM = {
  id: null,
  title: "",
  badge: "",
  heading: "",
  description: "",
  button_text: "Belanja Sekarang",
  button_link: "",
  button2_text: "",
  button2_link: "",
  sale_price: "",
  original_price: "",
  text_position: "left",
  overlay_opacity: 0.35,
  order: 0,
  link_url: "",
  is_active: true,
  image: null,
  product_image: null,
};

/* ── helpers ── */
const FieldRow = ({ label, hint, children }) => (
  <div className="mb-3">
    <label className="form-label fw-semibold" style={{ fontSize: "0.84rem" }}>
      {label}
    </label>
    {children}
    {hint && <small className="text-muted d-block mt-1" style={{ fontSize: "0.73rem" }}>{hint}</small>}
  </div>
);

const ImageDropZone = ({ preview, label, onFile, required, hint }) => {
  const [drag, setDrag] = useState(false);
  const ref = useRef(null);
  const process = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("File harus berupa gambar."); return; }
    onFile(file, URL.createObjectURL(file));
  };
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold" style={{ fontSize: "0.84rem" }}>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div
        onClick={() => ref.current?.click()}
        onDrop={(e) => { e.preventDefault(); setDrag(false); process(e.dataTransfer.files[0]); }}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        style={{
          border: `2px dashed ${drag ? "var(--primary)" : "#ddd"}`,
          borderRadius: 12,
          background: drag ? "var(--primary-light)" : "#fafafa",
          overflow: "hidden",
          cursor: "pointer",
          minHeight: preview ? 0 : 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: preview ? 0 : "24px 16px",
          transition: "all 0.2s",
          position: "relative",
        }}
      >
        {preview ? (
          <>
            <img src={preview} alt="preview" style={{ width: "100%", maxHeight: 180, objectFit: "cover", display: "block" }} />
            <div
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseOut={(e) => (e.currentTarget.style.opacity = 0)}
            >
              <i className="bi bi-camera-fill" style={{ color: "#fff", fontSize: "1.4rem" }} />
              <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.8rem", marginTop: 4 }}>Ganti Gambar</span>
            </div>
          </>
        ) : (
          <>
            <i className="bi bi-cloud-upload" style={{ fontSize: "2rem", color: "#ccc", marginBottom: 8 }} />
            <div style={{ fontSize: "0.82rem", color: "#777", fontWeight: 500 }}>Drag & drop atau klik untuk pilih</div>
            {hint && <div style={{ fontSize: "0.7rem", color: "#aaa", marginTop: 2 }}>{hint}</div>}
          </>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => process(e.target.files[0])} />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════ */
const ManageBannersPage = () => {
  const [banners, setBanners]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast]       = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [bgPreview, setBgPreview]   = useState(null);
  const [prodPreview, setProdPreview] = useState(null);

  useEffect(() => { fetchBanners(); }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await bannerApi.getAllBanners();
      const list = Array.isArray(data) ? data : data?.data ?? [];
      setBanners(list);
    } catch {
      showToast("Gagal memuat banner.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAddClick = () => {
    setFormData(EMPTY_FORM);
    setBgPreview(null);
    setProdPreview(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditClick = (b) => {
    setFormData({
      id:              b.id,
      title:           b.title           || "",
      badge:           b.badge           || "",
      heading:         b.heading         || "",
      description:     b.description     || "",
      button_text:     b.button_text     || "Belanja Sekarang",
      button_link:     b.button_link     || "",
      button2_text:    b.button2_text    || "",
      button2_link:    b.button2_link    || "",
      sale_price:      b.sale_price      || "",
      original_price:  b.original_price  || "",
      text_position:   b.text_position   || "left",
      overlay_opacity: b.overlay_opacity ?? 0.35,
      order:           b.order           ?? 0,
      link_url:        b.link_url        || "",
      is_active:       b.is_active !== undefined ? b.is_active : true,
      image:           null,
    });
    setBgPreview(resolveUrl(b.image_url));
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setBgPreview(null);
    setFormData(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing && !formData.image) {
      showToast("Pilih gambar background banner terlebih dahulu.", "error");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title",           formData.title);
      fd.append("badge",           formData.badge);
      fd.append("heading",         formData.heading);
      fd.append("description",     formData.description);
      fd.append("button_text",     formData.button_text);
      fd.append("button_link",     formData.button_link);
      fd.append("button2_text",    formData.button2_text);
      fd.append("button2_link",    formData.button2_link);
      fd.append("sale_price",      formData.sale_price);
      fd.append("original_price",  formData.original_price);
      fd.append("text_position",   formData.text_position);
      fd.append("overlay_opacity", formData.overlay_opacity);
      fd.append("order",           formData.order);
      fd.append("link_url",        formData.link_url);
      fd.append("is_active",       formData.is_active);
      if (formData.image)         fd.append("image",         formData.image);

      if (isEditing) {
        await bannerApi.updateBanner(formData.id, fd);
        showToast("Banner berhasil diperbarui!");
      } else {
        await bannerApi.createBanner(fd);
        showToast("Banner berhasil ditambahkan!");
      }
      setShowForm(false);
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
    } catch {
      showToast("Gagal menghapus banner.", "error");
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      const fd = new FormData();
      fd.append("title",     banner.title);
      fd.append("is_active", !banner.is_active);
      await bannerApi.updateBanner(banner.id, fd);
      showToast(!banner.is_active ? "Banner diaktifkan!" : "Banner dinonaktifkan.");
      fetchBanners();
    } catch {
      showToast("Gagal mengubah status banner.", "error");
    }
  };

  const activeBanners   = banners.filter((b) => b.is_active);
  const inactiveBanners = banners.filter((b) => !b.is_active);

  /* ─── RENDER ─── */
  return (
    <div style={{ position: "relative", minHeight: 400 }}>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 9999,
          background: toast.type === "error" ? "#ef4444" : "#22c55e",
          color: "#fff", borderRadius: 12, padding: "12px 20px",
          fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "0.88rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          display: "flex", alignItems: "center", gap: 10,
          animation: "slideInToast 0.3s ease both",
        }}>
          <i className={`bi ${toast.type === "error" ? "bi-x-circle" : "bi-check-circle"}`} />
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0" style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.4rem" }}>
            <i className="bi bi-images me-2" style={{ color: "var(--primary)" }} />
            Manajemen Banner
          </h2>
          <p className="text-muted mb-0 mt-1" style={{ fontSize: "0.83rem" }}>
            Kelola hero banner carousel yang tampil di halaman utama
          </p>
        </div>
        {!showForm && (
          <button onClick={handleAddClick} className="btn btn-primary fw-bold">
            <i className="bi bi-plus-lg me-1" /> Tambah Banner
          </button>
        )}
      </div>

      {/* STATS */}
      {!showForm && (
        <div className="row g-3 mb-4">
          {[
            { label: "Total Banner", value: banners.length,          icon: "bi-images",           color: "#6366f1" },
            { label: "Aktif",        value: activeBanners.length,    icon: "bi-check-circle-fill", color: "#22c55e" },
            { label: "Nonaktif",     value: inactiveBanners.length,  icon: "bi-dash-circle",       color: "#94a3b8" },
          ].map((s) => (
            <div key={s.label} className="col-4">
              <div className="d-flex align-items-center gap-3 p-3"
                style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: s.color + "18",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem", color: s.color, flexShrink: 0 }}>
                  <i className={`bi ${s.icon}`} />
                </div>
                <div>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "1.3rem", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: "0.75rem", color: "#888", marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        /* ═══════ FORM ADD/EDIT ═══════ */
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #eee",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)", overflow: "hidden", marginBottom: 32 }}>

          {/* Form header */}
          <div style={{
            background: isEditing
              ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              : "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
            padding: "18px 28px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <i className={`bi ${isEditing ? "bi-pencil-square" : "bi-plus-square"}`} style={{ color: "#fff", fontSize: "1.2rem" }} />
              <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#fff", fontSize: "1rem" }}>
                {isEditing ? "Edit Banner" : "Tambah Banner Baru"}
              </span>
            </div>
            <button onClick={handleCancel}
              style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8,
                color: "#fff", width: 32, height: 32, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="bi bi-x-lg" />
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: "28px" }}>
            <div className="row gy-0 gx-4">

              {/* ── LEFT: Images ── */}
              <div className="col-md-5">
                <h6 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "0.85rem",
                  color: "#444", borderBottom: "2px solid #f1f5f9", paddingBottom: 8, marginBottom: 16 }}>
                  <i className="bi bi-image me-2" style={{ color: "var(--primary)" }} />Gambar
                </h6>

                <ImageDropZone
                  label="Background Banner"
                  required={!isEditing}
                  hint="Rekomendasi: 1920×500px. JPG/PNG/WebP maks 5MB"
                  preview={bgPreview}
                  onFile={(file, prev) => { setFormData((p) => ({ ...p, image: file })); setBgPreview(prev); }}
                />



                {/* Text position */}
                <FieldRow label="Posisi Teks">
                  <div className="d-flex gap-2">
                    {["left", "center", "right"].map((pos) => (
                      <label key={pos} style={{
                        flex: 1, textAlign: "center", border: `2px solid ${formData.text_position === pos ? "var(--primary)" : "#e2e8f0"}`,
                        borderRadius: 8, padding: "7px 4px", cursor: "pointer", fontSize: "0.78rem",
                        fontWeight: 600, fontFamily: "Poppins,sans-serif",
                        background: formData.text_position === pos ? "var(--primary-light)" : "#fff",
                        color: formData.text_position === pos ? "var(--primary-dark)" : "#64748b",
                        transition: "all 0.15s",
                      }}>
                        <input type="radio" name="text_position" value={pos}
                          checked={formData.text_position === pos} onChange={handleChange} style={{ display: "none" }} />
                        <i className={`bi bi-text-${pos === "left" ? "left" : pos === "center" ? "center" : "right"} d-block mb-1`} />
                        {pos.charAt(0).toUpperCase() + pos.slice(1)}
                      </label>
                    ))}
                  </div>
                </FieldRow>

                {/* Overlay opacity */}
                <FieldRow label={`Gelap Overlay: ${Math.round(formData.overlay_opacity * 100)}%`}
                  hint="Semakin tinggi = latar lebih gelap, teks lebih mudah terbaca">
                  <input type="range" className="form-range" min="0" max="1" step="0.05"
                    name="overlay_opacity" value={formData.overlay_opacity} onChange={handleChange} />
                </FieldRow>

                {/* Order */}
                <FieldRow label="Urutan Tampil" hint="Angka kecil = tampil lebih awal">
                  <input type="number" className="form-control" name="order" value={formData.order}
                    onChange={handleChange} min="0" style={{ borderRadius: 8, fontSize: "0.88rem" }} />
                </FieldRow>

                {/* Active toggle */}
                <div
                  onClick={() => setFormData((p) => ({ ...p, is_active: !p.is_active }))}
                  style={{
                    background: formData.is_active ? "#f0fdf4" : "#f8f9fa",
                    border: `1.5px solid ${formData.is_active ? "#bbf7d0" : "#e2e8f0"}`,
                    borderRadius: 12, padding: "12px 16px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <i className={`bi ${formData.is_active ? "bi-eye-fill" : "bi-eye-slash"}`}
                      style={{ color: formData.is_active ? "#22c55e" : "#94a3b8", fontSize: "1.1rem" }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.86rem", color: formData.is_active ? "#16a34a" : "#64748b" }}>
                        {formData.is_active ? "Banner Aktif" : "Banner Nonaktif"}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#888" }}>
                        {formData.is_active ? "Tampil di carousel homepage" : "Disembunyikan dari homepage"}
                      </div>
                    </div>
                  </div>
                  <div style={{ width: 44, height: 24, borderRadius: 12,
                    background: formData.is_active ? "#22c55e" : "#cbd5e1",
                    position: "relative", flexShrink: 0, transition: "background 0.2s" }}>
                    <div style={{
                      position: "absolute", top: 2, left: formData.is_active ? 22 : 2,
                      width: 20, height: 20, borderRadius: "50%", background: "#fff",
                      transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    }} />
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Text content ── */}
              <div className="col-md-7">
                <h6 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "0.85rem",
                  color: "#444", borderBottom: "2px solid #f1f5f9", paddingBottom: 8, marginBottom: 16 }}>
                  <i className="bi bi-type me-2" style={{ color: "var(--primary)" }} />Konten Teks
                </h6>

                <div className="row gx-3">
                  <div className="col-md-6">
                    <FieldRow label="Badge (opsional)" hint='Contoh: FLASH SALE, DISKON 50%'>
                      <div className="input-group">
                        <span className="input-group-text" style={{ borderRadius: "8px 0 0 8px", background: "#fff3e0" }}>
                          <i className="bi bi-lightning-charge-fill" style={{ color: "var(--primary)" }} />
                        </span>
                        <input type="text" className="form-control" name="badge" value={formData.badge}
                          onChange={handleChange} placeholder="FLASH SALE"
                          style={{ borderRadius: "0 8px 8px 0", fontSize: "0.87rem" }} />
                      </div>
                    </FieldRow>
                  </div>
                  <div className="col-md-6">
                    <FieldRow label="Heading Kecil (opsional)" hint='Contoh: NEW COLLECTION'>
                      <input type="text" className="form-control" name="heading" value={formData.heading}
                        onChange={handleChange} placeholder="NEW COLLECTION"
                        style={{ borderRadius: 8, fontSize: "0.87rem" }} />
                    </FieldRow>
                  </div>
                </div>

                <FieldRow label={<>Judul Banner <span className="text-danger">*</span></>}
                  hint="Judul utama besar yang tampil di slide">
                  <input type="text" className="form-control" name="title" value={formData.title}
                    onChange={handleChange} placeholder="Contoh: ASUS ROG STRIX G16" required
                    style={{ borderRadius: 8, fontSize: "0.87rem", fontWeight: 600 }} />
                </FieldRow>

                <FieldRow label="Deskripsi (opsional)" hint="Kalimat singkat pendukung judul">
                  <textarea className="form-control" name="description" value={formData.description}
                    onChange={handleChange} rows={2}
                    placeholder="Performa terbaik untuk gaming dan produktivitas tanpa batas."
                    style={{ borderRadius: 8, fontSize: "0.87rem", resize: "vertical" }} />
                </FieldRow>

                <div className="row gx-3">
                  <div className="col-md-6">
                    <FieldRow label="Harga Promo (opsional)" hint='Contoh: Rp 17.999.000'>
                      <input type="text" className="form-control" name="sale_price" value={formData.sale_price}
                        onChange={handleChange} placeholder="Rp 17.999.000"
                        style={{ borderRadius: 8, fontSize: "0.87rem", color: "var(--primary)", fontWeight: 700 }} />
                    </FieldRow>
                  </div>
                  <div className="col-md-6">
                    <FieldRow label="Harga Asli (opsional)" hint='Akan dicoret. Contoh: Rp 24.999.000'>
                      <input type="text" className="form-control" name="original_price" value={formData.original_price}
                        onChange={handleChange} placeholder="Rp 24.999.000"
                        style={{ borderRadius: 8, fontSize: "0.87rem", textDecoration: "line-through", color: "#888" }} />
                    </FieldRow>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 14, marginTop: 4, marginBottom: 14 }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b",
                    fontFamily: "Poppins,sans-serif", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>
                    <i className="bi bi-cursor-fill me-2" style={{ color: "var(--primary)" }} />Tombol CTA
                  </div>
                  <div className="row gx-3">
                    <div className="col-md-6">
                      <FieldRow label="Teks Tombol Utama">
                        <input type="text" className="form-control" name="button_text" value={formData.button_text}
                          onChange={handleChange} placeholder="Belanja Sekarang"
                          style={{ borderRadius: 8, fontSize: "0.87rem" }} />
                      </FieldRow>
                    </div>
                    <div className="col-md-6">
                      <FieldRow label="Link Tombol Utama">
                        <input type="text" className="form-control" name="button_link" value={formData.button_link}
                          onChange={handleChange} placeholder="/products atau https://..."
                          style={{ borderRadius: 8, fontSize: "0.87rem" }} />
                      </FieldRow>
                    </div>
                    <div className="col-md-6">
                      <FieldRow label="Teks Tombol Kedua (opsional)">
                        <input type="text" className="form-control" name="button2_text" value={formData.button2_text}
                          onChange={handleChange} placeholder="Lihat Promo"
                          style={{ borderRadius: 8, fontSize: "0.87rem" }} />
                      </FieldRow>
                    </div>
                    <div className="col-md-6">
                      <FieldRow label="Link Tombol Kedua (opsional)">
                        <input type="text" className="form-control" name="button2_link" value={formData.button2_link}
                          onChange={handleChange} placeholder="/promo"
                          style={{ borderRadius: 8, fontSize: "0.87rem" }} />
                      </FieldRow>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="d-flex gap-3 mt-2">
                  <button type="submit" className="btn btn-primary fw-bold px-5" disabled={saving}>
                    {saving
                      ? <><span className="spinner-border spinner-border-sm me-2" />Menyimpan...</>
                      : <><i className="bi bi-check-lg me-2" />{isEditing ? "Simpan Perubahan" : "Tambah Banner"}</>
                    }
                  </button>
                  <button type="button" className="btn btn-outline-secondary fw-semibold" onClick={handleCancel}>
                    <i className="bi bi-x-lg me-2" />Batal
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

      ) : (
        /* ═══════ BANNER LIST ═══════ */
        <>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: "var(--primary)" }} />
              <p className="text-muted mt-3" style={{ fontSize: "0.88rem" }}>Memuat banner...</p>
            </div>
          ) : banners.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #eee",
              padding: "60px 32px", textAlign: "center" }}>
              <i className="bi bi-images" style={{ fontSize: "3rem", color: "#ddd", display: "block", marginBottom: 16 }} />
              <h5 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#888" }}>Belum ada banner</h5>
              <p className="text-muted" style={{ fontSize: "0.85rem", marginBottom: 20 }}>
                Klik tombol "Tambah Banner" untuk menambahkan banner pertama Anda.
              </p>
              <button onClick={handleAddClick} className="btn btn-primary">
                <i className="bi bi-plus-lg me-2" />Tambah Banner
              </button>
            </div>
          ) : (
            <>
              {/* Preview strip */}
              {activeBanners.length > 0 && (
                <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                  borderRadius: 16, padding: 16, marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <i className="bi bi-play-circle-fill" style={{ color: "var(--primary)" }} />
                    <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.85rem", fontFamily: "Poppins,sans-serif" }}>
                      Preview Carousel ({activeBanners.length} banner aktif)
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                    {activeBanners.map((b, idx) => (
                      <div key={b.id} style={{ position: "relative", flexShrink: 0, width: 160, height: 70,
                        borderRadius: 8, overflow: "hidden", border: "2px solid rgba(255,152,0,0.4)" }}>
                        <img src={resolveUrl(b.image_url) || ""}
                          alt={b.title} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { e.target.src = "https://placehold.co/160x70/374151/9ca3af?text=No+Image"; }} />
                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)",
                          display: "flex", alignItems: "flex-end", padding: "4px 6px" }}>
                          <span style={{ color: "#fff", fontSize: "0.65rem", fontWeight: 600 }}>#{idx + 1} {b.badge && `· ${b.badge}`}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Banner grid */}
              <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 mb-4">
                {banners.map((banner) => {
                  const imgSrc = resolveUrl(banner.image_url);
                  const prodSrc = resolveUrl(banner.product_image);
                  return (
                    <div className="col" key={banner.id}>
                      <div style={{
                        background: "#fff", borderRadius: 16,
                        border: `1.5px solid ${banner.is_active ? "#bbf7d0" : "#e2e8f0"}`,
                        overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                        transition: "all 0.2s ease",
                      }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}
                      >
                        {/* Banner image */}
                        <div style={{ position: "relative", height: 150, background: "#f1f5f9", overflow: "hidden" }}>
                          {imgSrc
                            ? <img src={imgSrc} alt={banner.title} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => { e.target.src = "https://placehold.co/400x150/e2e8f0/94a3b8?text=No+Image"; }} />
                            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="bi bi-image" style={{ fontSize: "2rem", color: "#ccc" }} />
                              </div>
                          }
                          {/* Product image badge */}
                          {prodSrc && (
                            <img src={prodSrc} alt="" style={{
                              position: "absolute", right: 8, bottom: 8, height: 60,
                              objectFit: "contain", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
                            }} onError={(e) => { e.target.style.display = "none"; }} />
                          )}
                          {/* Status badge */}
                          <span style={{
                            position: "absolute", top: 8, left: 8,
                            background: banner.is_active ? "#22c55e" : "#64748b",
                            color: "#fff", fontSize: "0.65rem", fontWeight: 700,
                            padding: "3px 8px", borderRadius: 20, fontFamily: "Poppins, sans-serif",
                          }}>
                            {banner.is_active ? "● Aktif" : "● Nonaktif"}
                          </span>
                          {/* Badge pill */}
                          {banner.badge && (
                            <span style={{
                              position: "absolute", top: 8, right: 8,
                              background: "var(--primary)", color: "#fff",
                              fontSize: "0.62rem", fontWeight: 700, padding: "2px 8px",
                              borderRadius: 20, fontFamily: "Poppins, sans-serif",
                            }}>
                              {banner.badge}
                            </span>
                          )}
                          {/* Order number */}
                          <span style={{
                            position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.55)",
                            color: "#fff", fontSize: "0.62rem", fontWeight: 600,
                            padding: "2px 7px", borderRadius: 6,
                          }}>
                            #{banner.order ?? 0}
                          </span>
                        </div>

                        {/* Card body */}
                        <div style={{ padding: "12px 14px 6px" }}>
                          <h6 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "0.88rem",
                            marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {banner.title}
                          </h6>
                          {banner.heading && (
                            <div style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: 600, marginBottom: 2 }}>
                              {banner.heading}
                            </div>
                          )}
                          {(banner.sale_price || banner.original_price) && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                              {banner.sale_price && (
                                <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--primary)", fontFamily: "Poppins,sans-serif" }}>
                                  {banner.sale_price}
                                </span>
                              )}
                              {banner.original_price && (
                                <span style={{ fontSize: "0.7rem", color: "#aaa", textDecoration: "line-through" }}>
                                  {banner.original_price}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div style={{ padding: "8px 14px 12px", display: "flex", gap: 7, borderTop: "1px solid #f1f5f9" }}>
                          <button onClick={() => handleToggleActive(banner)}
                            style={{ flex: 1, background: banner.is_active ? "#fef2f2" : "#f0fdf4",
                              color: banner.is_active ? "#ef4444" : "#16a34a",
                              border: `1px solid ${banner.is_active ? "#fecaca" : "#bbf7d0"}`,
                              borderRadius: 8, padding: "6px 0", fontSize: "0.75rem", fontWeight: 600,
                              cursor: "pointer", fontFamily: "Poppins, sans-serif", transition: "all 0.15s" }}>
                            <i className={`bi ${banner.is_active ? "bi-eye-slash" : "bi-eye-fill"} me-1`} />
                            {banner.is_active ? "Nonaktifkan" : "Aktifkan"}
                          </button>
                          <button onClick={() => handleEditClick(banner)}
                            style={{ flex: 1, background: "#eff6ff", color: "#2563eb",
                              border: "1px solid #bfdbfe", borderRadius: 8, padding: "6px 0",
                              fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
                              fontFamily: "Poppins, sans-serif", transition: "all 0.15s" }}>
                            <i className="bi bi-pencil me-1" />Edit
                          </button>
                          <button onClick={() => handleDelete(banner.id, banner.title)}
                            style={{ width: 34, background: "#fff", color: "#94a3b8", border: "1px solid #e2e8f0",
                              borderRadius: 8, fontSize: "0.85rem", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                              transition: "all 0.15s" }}
                            onMouseOver={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "#fecaca"; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
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
