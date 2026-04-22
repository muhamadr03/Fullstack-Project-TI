import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext"; // Import Context
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { totalItems } = useContext(CartContext); // Ambil angka total barang
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          TOKO KITA
        </Link>

        {/* ... bagian menu lainnya ... */}

        <div className="d-flex align-items-center">
          {/* Ikon Keranjang dengan Badge */}
          <Link to="/cart" className="nav-link position-relative me-3">
            <i className="bi bi-cart fs-4"></i>
            {totalItems > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Menu Login/Profile */}
          {user ? (
            <div className="dropdown">
              <button
                className="btn btn-outline-primary dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                {user.name}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    Profil
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/orders">
                    Pesanan Saya
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-item" />
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
