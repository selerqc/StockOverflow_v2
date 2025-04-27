import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderOpen,
  BarChart,
  Settings,
  AlertCircle,
  LogOut,
  ChevronDown,
  Users,
} from "lucide-react";

import { Typography } from "antd";
import "../Layout/Sidebar.css";
const { Title, Text } = Typography;
const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const [isInventoryOpen, setIsInventoryOpen] = useState(true);
  const role = sessionStorage.getItem("role");

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, children }) => (
    <Link to={to} className={`nav-link ${isActive(to) ? "active" : ""}`}>
      <Icon size={20} />
      <span className='nav-text'>{children}</span>
    </Link>
  );

  const renderLinksByRole = () => {
    switch (role) {
      case "Admin":
        return (
          <>
            <Link to='/dashboard' className='dashboard-link'>
              <LayoutDashboard size={20} className='dashboard-icon' /> Dashboard
            </Link>

            <button
              onClick={() => setIsInventoryOpen(!isInventoryOpen)}
              className={`inventory-toggle ${isInventoryOpen ? "active" : ""}`}>
              <div className='flex items-center space-x-2'>
                <Package size={20} />
                <span className='nav-text'>Inventory</span>
              </div>
              <ChevronDown
                size={16}
                className={`toggle-icon ${isInventoryOpen ? "rotate" : ""}`}
              />
            </button>
            {isInventoryOpen && (
              <div className='sub-links'>
                <NavLink to='/products' icon={Package}>
                  Products
                </NavLink>
                <NavLink to='/categories' icon={FolderOpen}>
                  Categories
                </NavLink>
              </div>
            )}

            <NavLink to='/orders' icon={ShoppingCart}>
              Orders
            </NavLink>
            <NavLink to='/analytics' icon={BarChart}>
              Analytics
            </NavLink>
            <NavLink to='/alerts' icon={AlertCircle}>
              Alerts
            </NavLink>
            <NavLink to='/manage-users' icon={Users}>
              Manage Users
            </NavLink>
          </>
        );

      case "Employee":
        return (
          <>
            <button
              onClick={() => setIsInventoryOpen(!isInventoryOpen)}
              className={`inventory-toggle ${isInventoryOpen ? "active" : ""}`}>
              <div>
                <Package size={20} />
                <span className='nav-text'>Inventory</span>
              </div>
              <ChevronDown
                size={16}
                className={`toggle-icon ${isInventoryOpen ? "rotate" : ""}`}
              />
            </button>
            {isInventoryOpen && (
              <div className='sub-links'>
                <NavLink to='/products' icon={Package}>
                  Products
                </NavLink>
                <NavLink to='/categories' icon={FolderOpen}>
                  Categories
                </NavLink>
              </div>
            )}
            <NavLink to='/orders' icon={ShoppingCart}>
              Orders
            </NavLink>
          </>
        );

      case "Business Owner":
        return (
          <>
            <button
              onClick={() => setIsInventoryOpen(!isInventoryOpen)}
              className={`inventory-toggle ${isInventoryOpen ? "active" : ""}`}>
              <div className='flex items-center space-x-2'>
                <Package size={20} />
                <span className='nav-text'>Inventory</span>
              </div>
              <ChevronDown
                size={16}
                className={`toggle-icon ${isInventoryOpen ? "rotate" : ""}`}
              />
            </button>
            {isInventoryOpen && (
              <div className='sub-links'>
                <NavLink to='/products' icon={Package}>
                  Products
                </NavLink>
                <NavLink to='/categories' icon={FolderOpen}>
                  Categories
                </NavLink>
              </div>
            )}

            <NavLink to='/orders' icon={ShoppingCart}>
              Orders
            </NavLink>
            <NavLink to='/analytics' icon={BarChart}>
              Analytics
            </NavLink>
            <NavLink to='/alerts' icon={AlertCircle}>
              Alerts
            </NavLink>
          </>
        );

      default:
        return null;
    }
  };

  if (!role) return null;

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className='sidebar-content'>
        <div className='nav-container'>
          <nav className='nav-links'>{renderLinksByRole()}</nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
