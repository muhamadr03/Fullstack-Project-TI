import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isCollapsed, toggleCollapse }) => {
  const { user, logout } = useAuth();

  return (
    <div
      className={`admin-sidebar d-flex flex-column flex-shrink-0 py-3 ${isCollapsed ? "collapsed" : ""}`}
      style={{ minHeight: "100vh", position: "sticky", top: 0 }}
    >
      <div className="d-flex align-items-center justify-content-between px-3 mb-4">
        <a href="/" className="d-flex align-items-center text-decoration-none">
          <div className="bg-dark rounded text-white d-flex align-items-center justify-content-center me-2" style={{ width: "32px", height: "32px" }}>
            <i className="bi bi-heptagon-fill"></i>
          </div>
          <div className="sidebar-text lh-1">
            <span className="sidebar-logo fs-5 d-block text-dark">Zenith</span>
            <small className="text-muted fw-bold" style={{ fontSize: "0.6rem", letterSpacing: "1px" }}>DASHBOARD</small>
          </div>
        </a>
        <button onClick={toggleCollapse} className="collapse-btn d-none d-lg-flex border-0 text-muted">
          <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
        </button>
      </div>

      <div className="flex-grow-1 px-3" style={{ overflowY: "auto", overflowX: "hidden" }}>
        <div className="nav-section-title">MENU UTAMA</div>
        <ul className="nav nav-pills flex-column mb-3">
          <li className="nav-item">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <i className="bi bi-grid-1x2"></i>
              <span className="sidebar-text ms-2">Dashboard</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/orders"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <i className="bi bi-cart-check"></i>
              <span className="sidebar-text ms-2">Kelola Pesanan</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/products"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <i className="bi bi-box-seam"></i>
              <span className="sidebar-text ms-2">Kelola Produk</span>
            </NavLink>
          </li>
        </ul>

        <div className="nav-section-title">LAINNYA</div>
        <ul className="nav nav-pills flex-column mb-3">
          <li className="nav-item">
            <NavLink
              to="/"
              className="nav-link"
            >
              <i className="bi bi-house-door"></i>
              <span className="sidebar-text ms-2">Lihat Toko</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="mt-auto px-3 pt-3 border-top">
        <div className="d-flex align-items-center cursor-pointer" onClick={logout}>
          <div
            className="rounded-circle bg-dark d-flex justify-content-center align-items-center text-white me-2"
            style={{ width: "36px", height: "36px", flexShrink: 0 }}
          >
            {user?.name ? user.name.substring(0,2).toUpperCase() : "AD"}
          </div>
          <div className="user-info lh-1">
            <strong className="d-block text-dark" style={{fontSize: "0.85rem"}}>{user?.name || "Administrator"}</strong>
            <small className="text-muted" style={{fontSize: "0.75rem"}}>Admin</small>
          </div>
          <i className="bi bi-box-arrow-right ms-auto text-muted sidebar-text"></i>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
