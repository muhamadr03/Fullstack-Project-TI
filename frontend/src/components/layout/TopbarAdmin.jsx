import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const TopbarAdmin = ({ onToggleSidebar }) => {
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
            </div>

            <div className="d-flex align-items-center gap-3">
                <Link to="/admin/products" className="btn-zenith-dark d-none d-sm-inline-flex align-items-center text-decoration-none">
                    <i className="bi bi-plus-lg me-2"></i> New Product
                </Link>

                <div className="ms-2 d-flex align-items-center cursor-pointer">
                    <div className="rounded-circle bg-secondary d-flex justify-content-center align-items-center text-white" style={{ width: "36px", height: "36px", fontWeight: "600" }}>
                        {user?.name ? user.name.substring(0, 2).toUpperCase() : "AD"}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopbarAdmin;