import React, { useState } from "react";
import SideBar from "./SideBar";
import "./Layout.css";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout">
      <button
        className={`sidebar-toggle-button ${isSidebarOpen ? "open" : ""}`}
        onClick={toggleSidebar}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </button>

      {/* Sidebar */}
      <SideBar isOpen={isSidebarOpen} onCloseSidebar={toggleSidebar} />

      {/* Main content */}
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;
