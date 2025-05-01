import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Bell, User, Menu } from "lucide-react";
import "./Topbar.css";
import axios from "axios";
import { useToken } from "../../../hooks/TokenContext";
import { baseURL } from "../../../../config.js";

const TopBar = ({ onMenuClick }) => {
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  const { token } = useToken();

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
    const interval = setInterval(fetchUnreadAlerts, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='topbar-container'>
      <div className='topbar-content'>
        <div className='left-section'>
          <button onClick={onMenuClick} className='menu-button'>
            <Menu size={24} />
          </button>

          <div className='logo-icon'>
            <Package size={24} className='logo-icon-package' />
          </div>
          <span className='logo-text'>StockOverflow</span>
        </div>

        <div className='right-section'>
          <Link to='/alerts' className='alerts-link'>
            <Bell size={20} />
            {unreadAlerts > 0 && (
              <span className='unread-alerts-badge'>{unreadAlerts}</span>
            )}
          </Link>

          <div className='profile-section'>
            <button className='profile-button'>
              <div className='profile-icon'>
                <User size={20} />
              </div>
              <span className='profile-name'>
                {sessionStorage.getItem("user").toUpperCase()}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
