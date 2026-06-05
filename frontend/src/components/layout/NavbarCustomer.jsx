import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

const NavbarCustomer = () => {
    const { totalItems } = useContext(CartContext);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fungsi logout yang mengarahkan user kembali ke halaman login
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav 
            className="navbar navbar-expand-lg sticky-top" 
            style={{ 
                background: "rgba(255, 255, 255, 0.85)", 
                backdropFilter: "blur(12px)", 
                borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.03)"
            }}
        >
            <div className="container py-2">
                
                {/* LOGO SECTION */}
                <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2" to="/">
                    <div 
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" 
                        style={{ width: '38px', height: '38px' }}
                    >
                        <i className="bi bi-shop fs-5"></i>
                    </div>
                    <span 
                        style={{ 
                            background: "linear-gradient(90deg, #0b5ed7, #0dcaf0)", 
                            WebkitBackgroundClip: "text", 
                            WebkitTextFillColor: "transparent",
                            letterSpacing: "0.5px"
                        }}
                    >
                        E-SHOP
                    </span>
                </Link>

                {/* TOGGLE BUTTON MOBILE */}
                <button
                    className="navbar-toggler border-0 shadow-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    {/* MENU LINKS */}
                    <ul className="navbar-nav me-auto ms-lg-4 mb-2 mb-lg-0 mt-3 mt-lg-0 text-center text-lg-start">
                        <li className="nav-item">
                            <Link 
                                className="nav-link fw-bold text-primary px-3 d-inline-block d-lg-block" 
                                to="/"
                                style={{ 
                                    background: "rgba(13, 110, 253, 0.08)", 
                                    borderRadius: "10px",
                                }}
                            >
                                Beranda
                            </Link>
                        </li>
                    </ul>

                    {/* RIGHT ACTIONS (Icons & Profile) */}
                    <div className="d-flex align-items-center justify-content-center justify-content-lg-end gap-4 mt-3 mt-lg-0 pb-2 pb-lg-0">
                        
                        {/* Wishlist Icon */}
                        <Link 
                            to="/wishlist" 
                            className="text-danger position-relative" 
                            style={{ transition: "transform 0.2s" }} 
                            title="Daftar Keinginan"
                        >
                            <i className="bi bi-heart-fill fs-5" style={{ filter: "drop-shadow(0 2px 4px rgba(220, 53, 69, 0.3))" }}></i>
                        </Link>

                        {/* Cart Icon with Dynamic Badge */}
                        <Link 
                            to="/cart" 
                            className="text-dark position-relative" 
                            style={{ transition: "transform 0.2s" }} 
                            title="Keranjang"
                        >
                            <i className="bi bi-cart3 fs-5"></i>
                            {totalItems > 0 && (
                                <span 
                                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm"
                                    style={{ fontSize: "0.65rem", transform: "translate(-30%, -30%)" }}
                                >
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* Vertical Divider */}
                        <div className="vr d-none d-lg-block text-secondary" style={{ width: "2px", opacity: "0.2" }}></div>

                        {/* User / Auth Options */}
                        {user ? (
                            <div className="dropdown">
                                <button 
                                    className="btn btn-light dropdown-toggle rounded-pill d-flex align-items-center gap-2 px-3 py-2 fw-medium shadow-sm" 
                                    type="button" 
                                    data-bs-toggle="dropdown" 
                                    aria-expanded="false"
                                    style={{ 
                                        background: "white", 
                                        border: "1px solid rgba(13, 110, 253, 0.2)",
                                        color: "#0b5ed7"
                                    }}
                                >
                                    <i className="bi bi-person-circle fs-5"></i>
                                    <span>{user.name}</span>
                                </button>
                                
                                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-3" style={{ borderRadius: "16px", minWidth: "220px" }}>
                                    <div className="px-3 py-2 mb-2 border-bottom">
                                        <span className="fw-bold text-dark d-block">{user.name}</span>
                                        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle rounded-pill small mt-1">
                                            Role: {user.role}
                                        </span>
                                    </div>

                                    {/* MENU ADMIN */}
                                    {user.role === "admin" ? (
                                        <>
                                            <li>
                                                <Link className="dropdown-item py-2 d-flex align-items-center gap-3" to="/admin/dashboard">
                                                    <div className="bg-primary bg-opacity-10 p-2 rounded text-primary"><i className="bi bi-grid"></i></div> Dashboard Utama
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item py-2 d-flex align-items-center gap-3" to="/admin/orders">
                                                    <div className="bg-success bg-opacity-10 p-2 rounded text-success"><i className="bi bi-receipt"></i></div> Kelola Pesanan
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item py-2 d-flex align-items-center gap-3" to="/admin/products">
                                                    <div className="bg-info bg-opacity-10 p-2 rounded text-info"><i className="bi bi-box-seam"></i></div> Kelola Produk
                                                </Link>
                                            </li>
                                        </>
                                    ) : (
                                        /* MENU CUSTOMER */
                                        <>
                                            <li>
                                                <Link className="dropdown-item py-2 d-flex align-items-center gap-3" to="/profile">
                                                    <div className="bg-primary bg-opacity-10 p-2 rounded text-primary"><i className="bi bi-person"></i></div> Profil Saya
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item py-2 d-flex align-items-center gap-3" to="/orders">
                                                    <div className="bg-success bg-opacity-10 p-2 rounded text-success"><i className="bi bi-bag-check"></i></div> Riwayat Belanja
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item py-2 d-flex align-items-center gap-3" to="/wishlist">
                                                    <div className="bg-danger bg-opacity-10 p-2 rounded text-danger"><i className="bi bi-heart"></i></div> Wishlist
                                                </Link>
                                            </li>
                                        </>
                                    )}

                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button 
                                            className="dropdown-item text-danger py-2 d-flex align-items-center gap-2 fw-medium" 
                                            onClick={handleLogout}
                                        >
                                            <i className="bi bi-box-arrow-right fs-5"></i> Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            /* MENU GUEST (Belum Login) */
                            <div className="d-flex gap-2">
                                <Link to="/login" className="btn btn-outline-primary rounded-pill px-4 fw-medium shadow-sm bg-white">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary rounded-pill px-4 fw-medium shadow-sm">
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

export default NavbarCustomer;