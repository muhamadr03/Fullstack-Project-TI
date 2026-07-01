import React, { useState, useEffect } from "react";
import { userApi } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import toast from 'react-hot-toast';

const ManageUsersPage = () => {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.getAllUsers();
      // API mengembalikan { success: true, data: [...] }
      setUsers(response?.data || []);
    } catch (err) {
      console.error("Gagal memuat pengguna:", err);
      setError("Gagal mengambil data pengguna.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    const label = newRole === "admin" ? "admin" : "customer";
    if (!window.confirm(`Ubah role pengguna ini menjadi ${label}?`)) return;
    try {
      await userApi.updateUserRole(userId, newRole);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengubah role.");
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Hapus pengguna "${userName}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      await userApi.deleteUser(userId);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus pengguna.");
    }
  };

  // Fungsi untuk mendapatkan inisial nama
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Warna avatar berdasarkan ID
  const avatarColors = [
    "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
    "#f97316", "#10b981", "#3b82f6", "#14b8a6",
  ];
  const getAvatarColor = (id) => avatarColors[id % avatarColors.length];

  // Filter & search
  const filteredUsers = users.filter((u) => {
    const searchLower = searchTerm.toLowerCase();
    const matchSearch =
      u.name?.toLowerCase().includes(searchLower) ||
      u.email?.toLowerCase().includes(searchLower) ||
      String(u.id).includes(searchLower);
    const matchRole = filterRole ? u.role === filterRole : true;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const paginate = (page) => setCurrentPage(page);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted small">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">
            <i className="bi bi-people-fill me-2 text-primary"></i>Manajemen Pengguna
          </h2>
          <p className="text-muted mb-0 small mt-1">Kelola akun dan role seluruh pengguna terdaftar.</p>
        </div>
        <button onClick={fetchUsers} className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2">
          <i className="bi bi-arrow-clockwise"></i>Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* STATISTIK RINGKAS */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 p-3" style={{ background: "#eff6ff", borderRadius: "12px" }}>
            <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#2563eb" }}>{users.length}</div>
            <div className="text-muted small">Total Pengguna</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 p-3" style={{ background: "#f0fdf4", borderRadius: "12px" }}>
            <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#16a34a" }}>
              {users.filter(u => u.role === "customer").length}
            </div>
            <div className="text-muted small">Customer</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 p-3" style={{ background: "#fef2f2", borderRadius: "12px" }}>
            <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#dc2626" }}>
              {users.filter(u => u.role === "admin").length}
            </div>
            <div className="text-muted small">Admin</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 p-3" style={{ background: "#fafafa", borderRadius: "12px" }}>
            <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#374151" }}>
              {filteredUsers.length}
            </div>
            <div className="text-muted small">Hasil Filter</div>
          </div>
        </div>
      </div>

      {/* FILTER & PENCARIAN */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "12px" }}>
        <div className="card-body p-3">
          <div className="row gy-2 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Cari nama, email, atau ID..."
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
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Semua Role</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
            </div>
            <div className="col-md-3 text-end">
              <span className="badge bg-secondary rounded-pill px-3 py-2">
                {filteredUsers.length} pengguna ditemukan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TABEL PENGGUNA */}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "12px", overflow: "hidden" }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ background: "#f8fafc" }}>
                <tr>
                  <th className="ps-4 py-3 text-muted fw-semibold" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pengguna</th>
                  <th className="py-3 text-muted fw-semibold" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</th>
                  <th className="py-3 text-muted fw-semibold" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Role</th>
                  <th className="py-3 text-muted fw-semibold" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Bergabung</th>
                  <th className="text-center py-3 pe-4 text-muted fw-semibold" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      <i className="bi bi-person-x fs-1 d-block mb-2"></i>
                      Pengguna tidak ditemukan.
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((u) => (
                    <tr key={u.id} style={{ transition: "background 0.15s" }}>
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          {/* Avatar dengan inisial */}
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "50%",
                              background: getAvatarColor(u.id),
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: "0.8rem",
                              flexShrink: 0,
                            }}
                          >
                            {getInitials(u.name)}
                          </div>
                          <div>
                            <div className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                              {u.name}
                              {currentUser?.id === u.id && (
                                <span className="badge bg-warning text-dark ms-2" style={{ fontSize: "0.65rem" }}>Anda</span>
                              )}
                            </div>
                            <div className="text-muted" style={{ fontSize: "0.75rem" }}>ID: #{u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span style={{ fontSize: "0.875rem" }}>{u.email}</span>
                      </td>
                      <td className="py-3">
                        <span
                          className="badge rounded-pill px-3 py-2"
                          style={{
                            background: u.role === "admin" ? "#fef2f2" : "#eff6ff",
                            color: u.role === "admin" ? "#dc2626" : "#2563eb",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        >
                          <i className={`bi ${u.role === "admin" ? "bi-shield-fill-check" : "bi-person-fill"} me-1`}></i>
                          {u.role === "admin" ? "Admin" : "Customer"}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-muted" style={{ fontSize: "0.875rem" }}>
                          {u.created_at
                            ? new Date(u.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
                            : "-"}
                        </span>
                      </td>
                      <td className="pe-4 text-center py-3">
                        <div className="d-flex gap-2 justify-content-center">
                          {/* Dropdown ubah role */}
                          <div className="dropdown">
                            <button
                              className="btn btn-sm btn-outline-secondary dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              disabled={currentUser?.id === u.id}
                              title={
                                currentUser?.id === u.id
                                  ? "Tidak bisa mengubah role diri sendiri"
                                  : "Ubah Role"
                              }
                              style={{ fontSize: "0.8rem" }}
                            >
                              <i className="bi bi-shield-shaded me-1"></i>Role
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                              {u.role !== "admin" && (
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handleChangeRole(u.id, "admin")}
                                    style={{ fontSize: "0.85rem" }}
                                  >
                                    <i className="bi bi-shield-fill-check me-2 text-danger"></i>
                                    Jadikan Admin
                                  </button>
                                </li>
                              )}
                              {u.role !== "customer" && (
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handleChangeRole(u.id, "customer")}
                                    style={{ fontSize: "0.85rem" }}
                                  >
                                    <i className="bi bi-person-fill me-2 text-primary"></i>
                                    Jadikan Customer
                                  </button>
                                </li>
                              )}
                            </ul>
                          </div>

                          {/* Tombol hapus */}
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(u.id, u.name)}
                            disabled={currentUser?.id === u.id}
                            title={
                              currentUser?.id === u.id
                                ? "Tidak bisa menghapus akun sendiri"
                                : "Hapus Pengguna"
                            }
                            style={{ fontSize: "0.8rem" }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
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
        <nav className="d-flex justify-content-between align-items-center">
          <span className="text-muted small">
            Halaman {currentPage} dari {totalPages}
          </span>
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(index + 1)}
                >
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
                <i className="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ManageUsersPage;
