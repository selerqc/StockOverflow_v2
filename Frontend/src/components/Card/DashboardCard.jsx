import React from "react";
import "./DashboardCard.css";

const DashboardCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <div className='dashboard-card'>
      <div className='card-content'>
        <div className='card-info'>
          <p className='card-title'>{title}</p>
          <h3 className='card-value'>{value}</h3>
          {trend && (
            <p
              className={`card-trend ${
                trend.isPositive ? "positive" : "negative"
              }`}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className='icon-container'>
          <Icon size={24} className='card-icon' />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
