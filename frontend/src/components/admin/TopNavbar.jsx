import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const TopNavbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="admin-topbar d-flex align-items-center px-3 justify-content-between">
      <div className="d-flex align-items-center">
        {/* Toggle button for mobile */}
        <button
          className="btn btn-light d-lg-none me-3"
          onClick={onToggleSidebar}
        >
          <i className="bi bi-list"></i>
        </button>

        {/* Search Bar */}
        <div className="search-wrapper d-none d-md-block">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search anything..."
          />
          <span className="search-shortcut">⌘K</span>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <Link to="/admin/products" className="btn-zenith-dark d-none d-sm-inline-flex align-items-center text-decoration-none">
          <i className="bi bi-plus-lg me-2"></i> New Order
        </Link>
        
        <div className="topbar-icon">
          <i className="bi bi-moon"></i>
        </div>
        <div className="topbar-icon">
          <i className="bi bi-palette"></i>
        </div>
        <div className="topbar-icon position-relative">
          <i className="bi bi-bell"></i>
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{ marginTop: "10px", marginLeft: "-10px" }}>
            <span className="visually-hidden">New alerts</span>
          </span>
        </div>

        <div className="ms-2 d-flex align-items-center cursor-pointer">
          <div className="rounded-circle bg-secondary d-flex justify-content-center align-items-center text-white" style={{ width: "36px", height: "36px", fontWeight: "600" }}>
            {user?.name ? user.name.substring(0,2).toUpperCase() : "AD"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
