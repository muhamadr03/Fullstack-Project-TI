import React, { useState, useEffect } from "react";
import { couponApi } from "../../api/couponApi";

// Helper: cek apakah kupon sudah kadaluarsa
const isExpired = (valid_until) => {
  if (!valid_until) return false;
  return new Date() > new Date(valid_until);
};

// Helper: format tanggal lokal
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ManageCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const itemsPerPage = 8;

  // Form state — nama field sesuai kolom DB: discount_percentage, valid_until
  const emptyForm = {
    id: null,
    code: "",
    discount_percentage: "",
    max_discount: "",
    valid_until: "",
    is_active: true,
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await couponApi.getAllCoupons();
      // API mengembalikan { success: true, data: [...] }
      setCoupons(response?.data || []);
    } catch (err) {
      console.error("Gagal mengambil kupon:", err);
      setErrorMsg("Gagal memuat data kupon.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleAddClick = () => {
    setFormData(emptyForm);
    setIsEditing(false);
    setErrorMsg("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditClick = (coupon) => {
    setFormData({
      id: coupon.id,
      code: coupon.code || "",
      discount_percentage: coupon.discount_percentage ?? "",
      max_discount: coupon.max_discount ?? "",
      // valid_until dari DB berformat ISO, ambil bagian tanggalnya saja
      valid_until: coupon.valid_until ? coupon.valid_until.split("T")[0] : "",
      is_active: coupon.is_active !== undefined ? Boolean(coupon.is_active) : true,
    });
    setIsEditing(true);
    setErrorMsg("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMsg("");
    try {
      // Payload sesuai kolom DB
      const payload = {
        code: formData.code.trim().toUpperCase(),
        discount_percentage: Number(formData.discount_percentage),
        max_discount: formData.max_discount !== "" ? Number(formData.max_discount) : null,
        valid_until: formData.valid_until,
        is_active: formData.is_active,
      };

      if (isEditing) {
        await couponApi.updateCoupon(formData.id, payload);
        showSuccess("Kupon berhasil diperbarui.");
      } else {
        await couponApi.createCoupon(payload);
        showSuccess("Kupon berhasil ditambahkan.");
      }
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal menyimpan kupon. Coba lagi.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Hapus kupon "${code}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      await couponApi.deleteCoupon(id);
      showSuccess(`Kupon "${code}" berhasil dihapus.`);
      fetchCoupons();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal menghapus kupon.");
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      await couponApi.updateCoupon(coupon.id, {
        code: coupon.code,
        discount_percentage: coupon.discount_percentage,
        max_discount: coupon.max_discount,
        valid_until: coupon.valid_until ? coupon.valid_until.split("T")[0] : coupon.valid_until,
        is_active: !coupon.is_active,
      });
      showSuccess(`Status kupon "${coupon.code}" diperbarui.`);
      fetchCoupons();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal mengubah status kupon.");
    }
  };

  // Filter & search
  const filteredCoupons = coupons.filter((c) => {
    const matchSearch = c.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const expired = isExpired(c.valid_until);
    if (filterStatus === "active") return matchSearch && c.is_active && !expired;
    if (filterStatus === "inactive") return matchSearch && !c.is_active;
    if (filterStatus === "expired") return matchSearch && expired;
    return matchSearch;
  });

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCoupons = filteredCoupons.slice(indexOfFirst, indexOfLast);

  const paginate = (page) => setCurrentPage(page);

  // Statistik ringkas
  const totalActive = coupons.filter((c) => c.is_active && !isExpired(c.valid_until)).length;
  const totalExpired = coupons.filter((c) => isExpired(c.valid_until)).length;
  const totalInactive = coupons.filter((c) => !c.is_active).length;

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">
            <i className="bi bi-ticket-perforated-fill me-2 text-primary"></i>Manajemen Kupon
          </h2>
          <p className="text-muted mb-0 small mt-1">
            Kelola kode diskon untuk pelanggan toko Anda.
          </p>
        </div>
        {!showForm && (
          <button onClick={handleAddClick} className="btn btn-primary fw-bold d-flex align-items-center gap-2">
            <i className="bi bi-plus-lg"></i> Tambah Kupon
          </button>
        )}
      </div>

      {/* NOTIFIKASI */}
      {successMsg && (
        <div className="alert alert-success alert-dismissible d-flex align-items-center gap-2 py-2" role="alert">
          <i className="bi bi-check-circle-fill"></i>
          <span>{successMsg}</span>
          <button type="button" className="btn-close ms-auto" onClick={() => setSuccessMsg("")}></button>
        </div>
      )}
      {errorMsg && !showForm && (
        <div className="alert alert-danger alert-dismissible d-flex align-items-center gap-2 py-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <span>{errorMsg}</span>
          <button type="button" className="btn-close ms-auto" onClick={() => setErrorMsg("")}></button>
        </div>
      )}

      {showForm ? (
        /* ── FORM TAMBAH / EDIT ── */
        <div className="card shadow-sm border-0 mb-5" style={{ borderRadius: "12px", overflow: "hidden" }}>
          <div
            className="card-header fw-bold d-flex justify-content-between align-items-center py-3"
            style={{ background: isEditing ? "#eff6ff" : "#f0fdf4", borderBottom: "1px solid #e2e8f0" }}
          >
            <span style={{ color: isEditing ? "#1d4ed8" : "#15803d" }}>
              <i className={`bi ${isEditing ? "bi-pencil-square" : "bi-plus-circle-fill"} me-2`}></i>
              {isEditing ? "Edit Kupon" : "Tambah Kupon Baru"}
            </span>
            <button
              type="button"
              className="btn-close"
              onClick={() => { setShowForm(false); setErrorMsg(""); }}
            ></button>
          </div>

          <div className="card-body p-4">
            {errorMsg && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row mb-3 gy-3">
                {/* Kode Kupon */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Kode Kupon <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control text-uppercase fw-bold font-monospace"
                    name="code"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    placeholder="Contoh: DISKON10"
                    required
                    disabled={isEditing}
                    style={{ letterSpacing: "0.05em" }}
                  />
                  {isEditing && (
                    <small className="text-muted">Kode kupon tidak dapat diubah.</small>
                  )}
                </div>

                {/* Diskon (%) — kolom DB: discount_percentage */}
                <div className="col-md-2">
                  <label className="form-label fw-semibold">
                    Diskon (%) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      name="discount_percentage"
                      value={formData.discount_percentage}
                      onChange={handleInputChange}
                      min="1"
                      max="100"
                      placeholder="10"
                      required
                    />
                    <span className="input-group-text">%</span>
                  </div>
                </div>

                {/* Max Diskon Rp — kolom DB: max_discount */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">
                    Maks. Diskon Rp
                    <span className="text-muted fw-normal ms-1" style={{ fontSize: "0.75rem" }}>(opsional)</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">Rp</span>
                    <input
                      type="number"
                      className="form-control"
                      name="max_discount"
                      value={formData.max_discount}
                      onChange={handleInputChange}
                      min="0"
                      placeholder="Tanpa batas"
                    />
                  </div>
                </div>

                {/* Berlaku Hingga — kolom DB: valid_until */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">
                    Berlaku Hingga <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="valid_until"
                    value={formData.valid_until}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>

              {/* Status Aktif */}
              <div className="mb-4">
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    role="switch"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label fw-semibold" htmlFor="is_active">
                    {formData.is_active ? (
                      <span className="text-success">
                        <i className="bi bi-toggle-on me-1"></i>Kupon Aktif
                      </span>
                    ) : (
                      <span className="text-secondary">
                        <i className="bi bi-toggle-off me-1"></i>Kupon Nonaktif
                      </span>
                    )}
                  </label>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-success fw-semibold d-flex align-items-center gap-2"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm"></span>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg"></i>
                      {isEditing ? "Simpan Perubahan" : "Tambah Kupon"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => { setShowForm(false); setErrorMsg(""); }}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* STATISTIK RINGKAS */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card border-0 p-3" style={{ background: "#f0fdf4", borderRadius: "12px" }}>
                <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#16a34a" }}>{coupons.length}</div>
                <div className="text-muted small">Total Kupon</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 p-3" style={{ background: "#eff6ff", borderRadius: "12px" }}>
                <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#2563eb" }}>{totalActive}</div>
                <div className="text-muted small">Aktif</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 p-3" style={{ background: "#fef2f2", borderRadius: "12px" }}>
                <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#dc2626" }}>{totalExpired}</div>
                <div className="text-muted small">Kadaluarsa</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 p-3" style={{ background: "#fafafa", borderRadius: "12px" }}>
                <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#6b7280" }}>{totalInactive}</div>
                <div className="text-muted small">Nonaktif</div>
              </div>
            </div>
          </div>

          {/* FILTER */}
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "12px" }}>
            <div className="card-body p-3">
              <div className="row gy-2 align-items-center">
                <div className="col-md-5">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Cari kode kupon..."
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                    <option value="expired">Kadaluarsa</option>
                  </select>
                </div>
                <div className="col-md-4 text-end">
                  <span className="badge bg-secondary rounded-pill px-3 py-2">
                    {filteredCoupons.length} kupon ditemukan
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* TABEL */}
          <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "12px", overflow: "hidden" }}>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ background: "#f8fafc" }}>
                    <tr>
                      <th className="ps-4 py-3 text-muted fw-semibold" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Kode</th>
                      <th className="py-3 text-muted fw-semibold" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Diskon</th>
                      <th className="py-3 text-muted fw-semibold" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Maks. Diskon</th>
                      <th className="py-3 text-muted fw-semibold" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Berlaku Hingga</th>
                      <th className="py-3 text-muted fw-semibold" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                      <th className="text-center py-3 pe-4 text-muted fw-semibold" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className="text-muted small mt-2 mb-0">Memuat data kupon...</p>
                        </td>
                      </tr>
                    ) : currentCoupons.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">
                          <i className="bi bi-ticket-perforated fs-1 d-block mb-2"></i>
                          Kupon tidak ditemukan.
                        </td>
                      </tr>
                    ) : (
                      currentCoupons.map((coupon) => {
                        const expired = isExpired(coupon.valid_until);
                        return (
                          <tr key={coupon.id}>
                            <td className="ps-4 py-3">
                              <span
                                className="fw-bold font-monospace"
                                style={{
                                  background: "#f1f5f9",
                                  padding: "4px 10px",
                                  borderRadius: "6px",
                                  fontSize: "0.875rem",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                {coupon.code}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className="fw-bold" style={{ color: "#6366f1", fontSize: "1rem" }}>
                                {coupon.discount_percentage}%
                              </span>
                            </td>
                            <td className="py-3">
                              {coupon.max_discount ? (
                                <span style={{ fontSize: "0.875rem" }}>
                                  Rp {Number(coupon.max_discount).toLocaleString("id-ID")}
                                </span>
                              ) : (
                                <span className="text-muted" style={{ fontSize: "0.875rem" }}>Tanpa batas</span>
                              )}
                            </td>
                            <td className="py-3">
                              <span
                                style={{ fontSize: "0.875rem" }}
                                className={expired ? "text-danger fw-semibold" : ""}
                              >
                                {formatDate(coupon.valid_until)}
                                {expired && (
                                  <span className="badge ms-2" style={{ background: "#fef2f2", color: "#dc2626", fontSize: "0.65rem" }}>
                                    Kadaluarsa
                                  </span>
                                )}
                              </span>
                            </td>
                            <td className="py-3">
                              {expired ? (
                                <span className="badge rounded-pill px-3 py-2" style={{ background: "#fef2f2", color: "#dc2626", fontWeight: 600, fontSize: "0.75rem" }}>
                                  <i className="bi bi-clock-history me-1"></i>Kadaluarsa
                                </span>
                              ) : coupon.is_active ? (
                                <span className="badge rounded-pill px-3 py-2" style={{ background: "#f0fdf4", color: "#16a34a", fontWeight: 600, fontSize: "0.75rem" }}>
                                  <i className="bi bi-check-circle-fill me-1"></i>Aktif
                                </span>
                              ) : (
                                <span className="badge rounded-pill px-3 py-2" style={{ background: "#f1f5f9", color: "#6b7280", fontWeight: 600, fontSize: "0.75rem" }}>
                                  <i className="bi bi-dash-circle-fill me-1"></i>Nonaktif
                                </span>
                              )}
                            </td>
                            <td className="pe-4 text-center py-3">
                              <div className="d-flex gap-2 justify-content-center">
                                {/* Toggle aktif/nonaktif */}
                                <button
                                  className={`btn btn-sm ${coupon.is_active ? "btn-outline-warning" : "btn-outline-success"}`}
                                  onClick={() => handleToggleActive(coupon)}
                                  title={coupon.is_active ? "Nonaktifkan" : "Aktifkan"}
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  <i className={`bi ${coupon.is_active ? "bi-toggle-off" : "bi-toggle-on"}`}></i>
                                </button>
                                {/* Edit */}
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEditClick(coupon)}
                                  title="Edit"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                {/* Hapus */}
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(coupon.id, coupon.code)}
                                  title="Hapus"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* PAGINASI */}
          {totalPages > 1 && (
            <nav className="d-flex justify-content-between align-items-center">
              <span className="text-muted small">Halaman {currentPage} dari {totalPages}</span>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                    <i className="bi bi-chevron-right"></i>
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

export default ManageCouponsPage;
