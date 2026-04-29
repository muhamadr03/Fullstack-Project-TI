import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // 👈 Perhatikan penambahan useNavigate
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { totalItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // 👈 Inisialisasi navigate

  // 👈 Ini adalah fungsi yang hilang dan menyebabkan layar putih!
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold text-primary" to="/">
          E-SHOP
        </Link>

        {/* Toggle Button untuk Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Beranda
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            {/* Ikon Keranjang dengan Badge Angka */}
            <Link
              to="/cart"
              className="nav-link position-relative me-3 text-dark"
            >
              <i className="bi bi-cart fs-4"></i>
              {totalItems > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.7rem" }}
                >
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Menu User (Login/Profil) */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle me-2"></i>
                  {user.name}
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                  {/* LOGIKA PINTAR: JIKA ADMIN, TAMPILKAN INI */}
                  {user.role === "admin" ? (
                    <>
                      <li className="dropdown-header text-uppercase small fw-bold text-primary">
                        Menu Admin
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/admin/dashboard">
                          Dashboard Utama
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/admin/orders">
                          Kelola Semua Pesanan
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/admin/products">
                          Kelola Produk
                        </Link>
                      </li>
                    </>
                  ) : (
                    /* JIKA PEMBELI BIASA, TAMPILKAN INI */
                    <>
                      <li className="dropdown-header text-uppercase small fw-bold text-primary">
                        Menu Pelanggan
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          Profil Saya
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/orders">
                          Riwayat Belanja
                        </Link>
                      </li>
                    </>
                  )}

                  {/* TOMBOL LOGOUT UNTUK SEMUANYA */}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="gap-2 d-flex">
                <Link to="/login" className="btn btn-outline-primary btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
