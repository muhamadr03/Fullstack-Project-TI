// src/components/layout/NavbarCustomer.jsx — Premium Fashion Store Navbar
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

const NAV_LINKS = [
  { label: "Beranda",  to: "/"           },
  { label: "Produk",   to: "/products"   },
  { label: "Kategori", to: "/categories" },
  { label: "Kontak",   to: "/#contact"   },
];

const NavbarCustomer = () => {
  const { totalItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const navigate  = useNavigate();
  const location  = useLocation();

  const [scrolled,   setScrolled]   = useState(false);
  const [searchVal,  setSearchVal]  = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  const handleContactClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchVal.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
    setSearchVal("");
    setSearchOpen(false);
  };

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <nav className={`lx-navbar ${scrolled ? "scrolled" : ""}`}>

      {/* ══════════ MAIN BAR ══════════ */}
      <div className="container-xl px-3 d-flex align-items-center gap-2" style={{ height: 64 }}>

        {/* Logo */}
        <Link to="/" className="lx-logo flex-shrink-0 d-flex align-items-center gap-2 me-2" style={{ textDecoration: "none" }}>
          <img
            src="/logo.png" alt="Logo"
            style={{ width: 32, height: 32, objectFit: "contain" }}
            onError={(e) => { e.target.onerror = null; e.target.src = "/logo.svg"; }}
          />
          <span>Shop<span className="text-primary">Ku</span></span>
        </Link>

        {/* Nav links — desktop */}
        <ul className="nav d-none d-lg-flex align-items-center gap-1 mb-0">
          {NAV_LINKS.map((l) => {
            const isContact = l.label === "Kontak";
            return (
              <li key={l.to} className="nav-item">
                {isContact ? (
                  <a href="#contact" onClick={handleContactClick} className="lx-nav-link" style={{ cursor: "pointer" }}>
                    {l.label}
                  </a>
                ) : (
                  <Link to={l.to} className={`lx-nav-link ${isActive(l.to) ? "active" : ""}`}>
                    {l.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Search bar — desktop */}
        <form onSubmit={handleSearch} className="lx-search d-none d-md-flex ms-auto" style={{ flex: 1, maxWidth: 320 }}>
          <i className="bi bi-search me-2" style={{ color: "#bbb", fontSize: "0.85rem", flexShrink: 0 }} />
          <input
            type="text" placeholder="Cari produk..."
            value={searchVal} onChange={(e) => setSearchVal(e.target.value)}
            aria-label="Cari produk"
          />
          <button type="submit" className="lx-search-btn" aria-label="Cari">
            <i className="bi bi-search" />
          </button>
        </form>

        {/* Right actions */}
        <div className="d-flex align-items-center gap-1 ms-auto ms-md-2 flex-shrink-0">

          {/* Search icon — mobile only */}
          <button
            className="lx-icon-btn d-md-none"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Cari"
          >
            <i className="bi bi-search" />
          </button>

          {/* Wishlist — desktop only */}
          <Link to="/wishlist" className="lx-icon-btn d-none d-md-flex" title="Favorit">
            <i className="bi bi-heart" />
          </Link>

          {/* Cart */}
          <Link to="/cart" className="lx-icon-btn" title="Keranjang" style={{ position: "relative" }}>
            <i className="bi bi-bag" />
            {totalItems > 0 && (
              <span className="lx-cart-badge">{totalItems > 9 ? "9+" : totalItems}</span>
            )}
          </Link>

          {/* Divider — desktop */}
          <div className="d-none d-md-block" style={{ width: 1, height: 24, background: "#e8e8e8", margin: "0 6px" }} />

          {/* Auth */}
          {user ? (
            <div className="dropdown">
              <button
                className="lx-profile-btn d-flex align-items-center gap-2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {/* Avatar circle */}
                <div className="lx-avatar">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
                {/* Name — desktop only */}
                <span className="d-none d-lg-inline lx-profile-name">
                  {user.name?.split(" ")[0]}
                </span>
                <i className="bi bi-chevron-down d-none d-sm-inline" style={{ fontSize: "0.6rem", color: "#999" }} />
              </button>

              <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2" style={{ borderRadius: 14, minWidth: 220, padding: "8px 4px" }}>
                {/* User info */}
                <li className="px-3 py-2">
                  <div style={{ fontWeight: 700, fontSize: "0.87rem", fontFamily: "'Poppins',sans-serif" }}>{user.name}</div>
                  <div style={{ fontSize: "0.72rem", color: "#999" }}>{user.email}</div>
                </li>
                <li><hr className="dropdown-divider my-1" /></li>

                {user.role === "admin" ? (
                  <>
                    <li><Link className="dropdown-item lx-dropdown-item" to="/admin/dashboard">
                      <i className="bi bi-speedometer2 text-warning" /> Dashboard Admin
                    </Link></li>
                    <li><Link className="dropdown-item lx-dropdown-item" to="/admin/products">
                      <i className="bi bi-box-seam" style={{ color: "#666" }} /> Kelola Produk
                    </Link></li>
                    <li><Link className="dropdown-item lx-dropdown-item" to="/admin/orders">
                      <i className="bi bi-receipt" style={{ color: "#666" }} /> Kelola Pesanan
                    </Link></li>
                  </>
                ) : (
                  <>
                    <li><Link className="dropdown-item lx-dropdown-item" to="/profile">
                      <i className="bi bi-person text-warning" /> Profil Saya
                    </Link></li>
                    <li><Link className="dropdown-item lx-dropdown-item" to="/orders">
                      <i className="bi bi-bag-check" style={{ color: "#666" }} /> Pesanan Saya
                    </Link></li>
                    <li><Link className="dropdown-item lx-dropdown-item" to="/wishlist">
                      <i className="bi bi-heart text-danger" /> Favorit
                    </Link></li>
                  </>
                )}

                <li><hr className="dropdown-divider my-1" /></li>
                <li>
                  <button className="dropdown-item lx-dropdown-item text-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right" /> Keluar
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-primary btn-sm px-3" style={{ fontSize: "0.8rem", borderRadius: 20 }}>Masuk</Link>
              <Link to="/register" className="btn btn-primary btn-sm px-3" style={{ fontSize: "0.8rem", borderRadius: 20 }}>Daftar</Link>
            </div>
          )}
        </div>
      </div>

      {/* ══════════ NAV STRIP — mobile only ══════════ */}
      <div className="lx-nav-strip d-lg-none">
        {NAV_LINKS.map((l) => {
          const isContact = l.label === "Kontak";
          return isContact ? (
            <a
              key={l.to}
              href="#contact"
              onClick={handleContactClick}
              className="lx-nav-strip-link"
            >
              {l.label}
            </a>
          ) : (
            <Link
              key={l.to}
              to={l.to}
              className={`lx-nav-strip-link ${isActive(l.to) ? "active" : ""}`}
            >
              {l.label}
            </Link>
          );
        })}
      </div>

      {/* ══════════ SEARCH DROPDOWN — mobile ══════════ */}
      {searchOpen && (
        <div className="d-md-none px-3 pb-3 pt-2 border-top" style={{ background: "#fff" }}>
          <form onSubmit={handleSearch} className="lx-search w-100">
            <i className="bi bi-search me-2" style={{ color: "#bbb", fontSize: "0.85rem", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              autoFocus
            />
            <button type="submit" className="lx-search-btn"><i className="bi bi-search" /></button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default NavbarCustomer;