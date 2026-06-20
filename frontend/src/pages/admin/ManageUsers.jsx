import React, { useState, useEffect } from "react";
import { userApi } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

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
      const data = await userApi.getAllUsers();
      setUsers(data || []);
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
      alert(err.response?.data?.message || "Gagal mengubah role.");
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Hapus pengguna "${userName}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      await userApi.deleteUser(userId);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus pengguna.");
    }
  };

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
          <i className="bi bi-people-fill me-2"></i>Manajemen Pengguna
        </h2>
        <button onClick={fetchUsers} className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-clockwise me-1"></i>Refresh Data
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* FILTER & PENCARIAN */}
      <div className="row mb-3 gy-2">
        <div className="col-md-5">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
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
        <div className="col-md-4 text-end text-muted small d-flex align-items-center justify-content-end">
          Menampilkan {filteredUsers.length} pengguna
        </div>
      </div>

      {/* TABEL PENGGUNA */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="ps-3">ID</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Tanggal Daftar</th>
                  <th className="text-center pe-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      Pengguna tidak ditemukan.
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((u) => (
                    <tr key={u.id}>
                      <td className="ps-3 text-muted">{u.id}</td>
                      <td className="fw-bold">{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.role === "admin" ? "bg-danger" : "bg-primary"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>
                        {u.created_at
                          ? new Date(u.created_at).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      <td className="pe-3 text-center">
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
                            >
                              <i className="bi bi-shield-shaded me-1"></i>Role
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              {u.role !== "admin" && (
                                <li>
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() => handleChangeRole(u.id, "admin")}
                                  >
                                    <i className="bi bi-shield-fill-check me-1"></i>
                                    Jadikan Admin
                                  </button>
                                </li>
                              )}
                              {u.role !== "customer" && (
                                <li>
                                  <button
                                    className="dropdown-item text-primary"
                                    onClick={() =>
                                      handleChangeRole(u.id, "customer")
                                    }
                                  >
                                    <i className="bi bi-person-fill me-1"></i>
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
                Selanjutnya
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ManageUsersPage;
