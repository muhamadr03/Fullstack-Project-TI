import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "../layout/SidebarAdmin";
import "../../assets/admin.css"; // Import the custom Zenith CSS

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleMobileSidebar = () => setShowMobileSidebar(!showMobileSidebar);

  return (
    <div className="admin-layout d-flex w-100" style={{ minHeight: "100vh", overflowX: "hidden" }}>
      {/* Mobile Backdrop */}
      {showMobileSidebar && (
        <div 
          className="position-fixed w-100 h-100 bg-dark d-lg-none" 
          style={{ opacity: 0.5, zIndex: 1030, top: 0, left: 0 }}
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* Sidebar Wrapper */}
      <div 
        className={`admin-sidebar-wrapper ${showMobileSidebar ? "show-mobile" : ""}`}
        style={{ zIndex: 1040 }}
      >
        <SidebarAdmin isCollapsed={isCollapsed && !showMobileSidebar} toggleCollapse={toggleCollapse} />
      </div>

      {/* Main Content Area */}
      <main className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0, height: "100vh", overflowY: "auto" }}>
        <div className="p-3 d-flex align-items-center d-lg-none">
            <button
                className="btn btn-light"
                onClick={toggleMobileSidebar}
            >
                <i className="bi bi-list"></i> Menu
            </button>
        </div>
        
        <div className="p-3 flex-grow-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
