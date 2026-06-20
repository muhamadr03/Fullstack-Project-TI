import React, { useState, useEffect } from "react";
import { couponApi } from "../../api/couponApi";

const ManageCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const emptyForm = {
    id: null,
    code: "",
    discount_percent: "",
    max_discount: "",
    expires_at: "",
    is_active: true,
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await couponApi.getAllCoupons();
      setCoupons(data || []);
    } catch (err) {
      console.error("Gagal mengambil kupon:", err);
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
    setShowForm(true);
  };

  const handleEditClick = (coupon) => {
    setFormData({
      id: coupon.id,
      code: coupon.code || "",
      discount_percent: coupon.discount_percent || "",
      max_discount: coupon.max_discount || "",
      expires_at: coupon.expires_at ? coupon.expires_at.split("T")[0] : "",
      is_active: coupon.is_active !== undefined ? coupon.is_active : true,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        code: formData.code.toUpperCase(),
        discount_percent: Number(formData.discount_percent),
        max_discount: formData.max_discount ? Number(formData.max_discount) : null,
        expires_at: formData.expires_at || null,
        is_active: formData.is_active,
      };

      if (isEditing) {
        await couponApi.updateCoupon(formData.id, payload);
      } else {
        await couponApi.createCoupon(payload);
      }
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan kupon.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Hapus kupon "${code}"?`)) return;
    try {
      await couponApi.deleteCoupon(id);
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus kupon.");
    }
  };

  // Filter & pagination
  const filteredCoupons = coupons.filter((c) =>
    c.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCoupons = filteredCoupons.slice(indexOfFirst, indexOfLast);

  const paginate = (page) => setCurrentPage(page);

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">
          <i className="bi bi-ticket-perforated-fill me-2"></i>Manajemen Kupon
        </h2>
        {!showForm && (
          <button onClick={handleAddClick} className="btn btn-primary fw-bold">
            <i className="bi bi-plus-lg me-1"></i> Tambah Kupon
          </button>
        )}
      </div>

      {showForm ? (
        /* ── FORM ── */
        <div className="card shadow-sm border-0 mb-5">
          <div className="card-header bg-dark text-white fw-bold">
            {isEditing ? "Edit Kupon" : "Tambah Kupon Baru"}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3 gy-3">
                {/* Kode Kupon */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Kode Kupon <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control text-uppercase"
                    name="code"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    placeholder="CONTOH10"
                    required
                  />
                </div>

                {/* Diskon % */}
                <div className="col-md-2">
                  <label className="form-label fw-semibold">
                    Diskon (%) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      name="discount_percent"
                      value={formData.discount_percent}
                      onChange={handleInputChange}
                      min="1"
                      max="100"
                      required
                    />
                    <span className="input-group-text">%</span>
                  </div>
                </div>

                {/* Max Diskon Rp */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Max Diskon Rp (opsional)</label>
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

                {/* Berlaku Hingga */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Berlaku Hingga</label>
                  <input
                    type="date"
                    className="form-control"
                    name="expires_at"
                    value={formData.expires_at}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Status */}
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
                  Aktif
                </label>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success" disabled={loading}>
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* FILTER */}
          <div className="row mb-3 gy-2">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari kode kupon..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <div className="col-md-8 text-end text-muted small d-flex align-items-center justify-content-end">
              {filteredCoupons.length} kupon ditemukan
            </div>
          </div>

          {/* TABEL */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th className="ps-3">Kode</th>
                      <th>Diskon</th>
                      <th>Max Diskon</th>
                      <th>Berlaku Hingga</th>
                      <th>Status</th>
                      <th className="text-center pe-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <div className="spinner-border spinner-border-sm text-primary" role="status" />
                        </td>
                      </tr>
                    ) : currentCoupons.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">
                          Kupon tidak ditemukan.
                        </td>
                      </tr>
                    ) : (
                      currentCoupons.map((coupon) => (
                        <tr key={coupon.id}>
                          <td className="ps-3 fw-bold font-monospace">{coupon.code}</td>
                          <td>{coupon.discount_percent}%</td>
                          <td>
                            {coupon.max_discount
                              ? `Rp ${Number(coupon.max_discount).toLocaleString("id-ID")}`
                              : <span className="text-muted">-</span>}
                          </td>
                          <td>
                            {coupon.expires_at
                              ? new Date(coupon.expires_at).toLocaleDateString("id-ID")
                              : <span className="text-muted">Tidak ada batas</span>}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                coupon.is_active ? "bg-success" : "bg-secondary"
                              }`}
                            >
                              {coupon.is_active ? "Aktif" : "Nonaktif"}
                            </span>
                          </td>
                          <td className="pe-3 text-center">
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleEditClick(coupon)}
                              title="Edit"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(coupon.id, coupon.code)}
                              title="Hapus"
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
                  <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                    Prev
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    <button className="page-link" onClick={() => paginate(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                >
                  <button className="page-link" onClick={() => paginate(currentPage + 1)}>
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

export default ManageCouponsPage;
