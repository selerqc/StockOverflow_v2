import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./Topbar";
import Sidebar from "./Sidebar";
import "./Layout.css"; // Import the separate CSS file

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className='layout-container'>
      <TopBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />
      <main
        className={`main-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
