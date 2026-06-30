// src/components/layout/NavbarCustomer.jsx — Premium Fashion Store Navbar
import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

const NAV_LINKS = [
  { label: "Beranda", to: "/" },
  { label: "Produk", to: "/products" },
  { label: "Kategori", to: "/categories" },
  { label: "Kontak", to: "/#contact" },
];

const NavbarCustomer = () => {
  const { totalItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      // Already on home page, just smooth scroll to contact
      const contactElement = document.getElementById("contact");
      if (contactElement) {
        contactElement.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Not on home page, navigate to home then scroll
      navigate("/");
      setTimeout(() => {
        const contactElement = document.getElementById("contact");
        if (contactElement) {
          contactElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchVal.trim();
    const target = query ? `/products?search=${encodeURIComponent(query)}` : "/products";
    navigate(target);
    setSearchVal("");
    setSearchOpen(false);
  };

  return (
    <nav className={`lx-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container-xl px-3 w-100 d-flex align-items-center gap-3">

        {/* ── LOGO ── */}
        <Link to="/" className="lx-logo flex-shrink-0" style={{ minWidth: 100 }}>
          Luxe<span>Store</span>
        </Link>

        {/* ── NAV LINKS (desktop) ── */}
        <ul className="nav d-none d-lg-flex align-items-center gap-1 mb-0 ps-2">
          {NAV_LINKS.map((l) => {
            const isContact = l.label === "Kontak";
            return (
              <li key={l.to} className="nav-item">
                {isContact ? (
                  <a
                    href="#contact"
                    onClick={handleContactClick}
                    className="lx-nav-link"
                    style={{ cursor: "pointer" }}
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    to={l.to}
                    className={`lx-nav-link ${l.to === "/" ? (location.pathname === "/" ? "active" : "") : (location.pathname.startsWith(l.to) ? "active" : "")}`}
                  >
                    {l.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* ── SEARCH BAR (desktop) ── */}
        <form
          onSubmit={handleSearch}
          className="lx-search d-none d-md-flex mx-auto"
          style={{ flex: 1, maxWidth: 360 }}
        >
          <i className="bi bi-search me-2" style={{ color: "#bbb", fontSize: "0.85rem", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            aria-label="Cari produk"
          />
          <button type="submit" className="lx-search-btn" aria-label="Cari">
            <i className="bi bi-search" />
          </button>
        </form>

        {/* ── RIGHT ACTIONS ── */}
        <div className="d-flex align-items-center gap-1 ms-auto flex-shrink-0">

          {/* Search icon (mobile) */}
          <button
            className="lx-icon-btn d-flex d-md-none"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Cari"
          >
            <i className="bi bi-search" />
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" className="lx-icon-btn" title="Favorit">
            <i className="bi bi-heart" />
          </Link>

          {/* Cart */}
          <Link to="/cart" className="lx-icon-btn" title="Keranjang" style={{ position: "relative" }}>
            <i className="bi bi-bag" />
            {totalItems > 0 && (
              <span className="lx-cart-badge">{totalItems > 9 ? "9+" : totalItems}</span>
            )}
          </Link>

          {/* Divider */}
          <div className="d-none d-md-block" style={{ width: 1, height: 26, background: "#eee", margin: "0 4px" }} />

          {/* Auth */}
          {user ? (
            <div className="dropdown">
              <button
                className="btn d-flex align-items-center gap-2 rounded-pill px-3 py-2"
                style={{
                  background: "#f5f5f5", border: "none",
                  fontFamily: "'Poppins',sans-serif", fontWeight: 600,
                  fontSize: "0.8rem", color: "#1f1f1f",
                }}
                data-bs-toggle="dropdown"
              >
                <div
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "linear-gradient(135deg,#ff9800,#ffd54f)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 800, fontSize: "0.75rem",
                    fontFamily: "'Poppins',sans-serif",
                  }}
                >
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="d-none d-lg-inline">{user.name?.split(" ")[0]}</span>
                <i className="bi bi-chevron-down" style={{ fontSize: "0.65rem" }} />
              </button>

              <ul
                className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2"
                style={{ borderRadius: 16, minWidth: 210, padding: 8 }}
              >
                <li className="px-3 py-2 mb-1">
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}>{user.name}</div>
                  <div style={{ fontSize: "0.72rem", color: "#999" }}>{user.email}</div>
                </li>
                <li><hr className="dropdown-divider my-1" /></li>

                {user.role === "admin" ? (
                  <>
                    <li><Link className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2" to="/admin/dashboard">
                      <i className="bi bi-grid" style={{ color: "#ff9800" }} /> Dashboard
                    </Link></li>
                    <li><Link className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2" to="/admin/products">
                      <i className="bi bi-box-seam" style={{ color: "#666" }} /> Kelola Produk
                    </Link></li>
                    <li><Link className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2" to="/admin/orders">
                      <i className="bi bi-receipt" style={{ color: "#666" }} /> Kelola Pesanan
                    </Link></li>
                  </>
                ) : (
                  <>
                    <li><Link className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2" to="/profile">
                      <i className="bi bi-person" style={{ color: "#ff9800" }} /> Profil Saya
                    </Link></li>
                    <li><Link className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2" to="/orders">
                      <i className="bi bi-bag-check" style={{ color: "#666" }} /> Pesanan Saya
                    </Link></li>
                    <li><Link className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2" to="/wishlist">
                      <i className="bi bi-heart" style={{ color: "#e53935" }} /> Favorit
                    </Link></li>
                  </>
                )}

                <li><hr className="dropdown-divider my-1" /></li>
                <li>
                  <button className="dropdown-item rounded-2 py-2 text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right" /> Keluar
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-primary btn-sm px-3 d-none d-sm-inline-flex" style={{ fontSize: "0.8rem" }}>
                Masuk
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm px-3" style={{ fontSize: "0.8rem" }}>
                Daftar
              </Link>
            </div>
          )}

          {/* Hamburger (mobile) */}
          <button
            className="lx-icon-btn d-lg-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <i className={`bi bi-${mobileOpen ? "x-lg" : "list"}`} />
          </button>
        </div>
      </div>

      {/* ── MOBILE SEARCH ── */}
      {searchOpen && (
        <div className="d-md-none px-3 pb-3 pt-1 border-top" style={{ background: "rgba(255,255,255,0.98)" }}>
          <form onSubmit={handleSearch} className="lx-search w-100">
            <i className="bi bi-search me-2" style={{ color: "#bbb", fontSize: "0.85rem", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              autoFocus
            />
            <button type="submit" className="lx-search-btn">
              <i className="bi bi-search" />
            </button>
          </form>
        </div>
      )}

      {/* ── MOBILE MENU ── */}
      {mobileOpen && (
        <div className="d-lg-none border-top" style={{ background: "#fff", padding: "8px 16px 16px" }}>
          {NAV_LINKS.map((l) => {
            const isContact = l.label === "Kontak";
            return isContact ? (
              <a
                key={l.to}
                href="#contact"
                onClick={handleContactClick}
                className="lx-nav-link d-block py-2 my-1"
                style={{ display: "block", cursor: "pointer" }}
              >
                {l.label}
              </a>
            ) : (
              <Link key={l.to} to={l.to} className="lx-nav-link d-block py-2 my-1" style={{ display: "block" }}>
                {l.label}
              </Link>
            );
          })}
          {!user && (
            <div className="d-flex gap-2 mt-3">
              <Link to="/login" className="btn btn-outline-primary btn-sm flex-grow-1">Masuk</Link>
              <Link to="/register" className="btn btn-primary btn-sm flex-grow-1">Daftar</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavbarCustomer;