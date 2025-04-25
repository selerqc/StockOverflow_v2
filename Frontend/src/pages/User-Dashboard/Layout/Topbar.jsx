import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Bell, User, Menu } from "lucide-react";
import "./Topbar.css";
import axios from "axios";
import { useToken } from "../../../hooks/TokenContext";
import { baseURL } from "../../../../config.js";

const TopBar = ({ onMenuClick }) => {
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { token, setToken } = useToken();

  const handleLogout = () => {
    axios.delete(`${baseURL}/alerts/deleteManyAlerts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setToken(null);
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("user");
  };
  const fetchUnreadAlerts = async () => {
    await axios
      .get(`${baseURL}/alerts/getUnreadCount`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUnreadAlerts(response.data.unreadCount);
      })
      .catch((error) => {
        console.error("Error fetching unread alerts count:", error);
      });
  };

  useEffect(() => {
    fetchUnreadAlerts();
    const interval = setInterval(fetchUnreadAlerts, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='topbar-container'>
      <div className='topbar-content'>
        <div className='left-section'>
          <button onClick={onMenuClick} className='menu-button'>
            <Menu size={24} />
          </button>
          <Link to='/dashboard' className='logo'>
            <div className='logo-icon'>
              <Package size={24} className='logo-icon-package' />
            </div>
            <span className='logo-text'>StockOverflow</span>
          </Link>
        </div>

        <div className='right-section'>
          <Link to='/alerts' className='alerts-link'>
            <Bell size={20} />
            {unreadAlerts > 0 && (
              <span className='unread-alerts-badge'>{unreadAlerts}</span>
            )}
          </Link>

          <div className='profile-section'>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className='profile-button'>
              <div className='profile-icon'>
                <User size={20} />
              </div>
              <span className='profile-name'>
                {sessionStorage.getItem("user").toUpperCase()}
              </span>
            </button>

            {isProfileOpen && (
              <div className='profile-menu'>
                <Link to='/settings' className='profile-menu-item'>
                  Settings
                </Link>

                <Link to='/login' className='profile-menu-item'>
                  <span onClick={handleLogout}> Log out </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
