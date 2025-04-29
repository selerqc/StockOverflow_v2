import React from "react";
import { Card, Statistic, Space, Tooltip } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const DashboardCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <Card hoverable className='dashboard-stat-card'>
      <Space
        direction='horizontal'
        size='large'
        align='start'
        style={{ width: "100%", justifyContent: "space-between" }}>
        <div>
          <Statistic
            title={title}
            value={value}
            valueStyle={{ fontWeight: 600 }}
          />
          {trend && (
            <Tooltip
              title={`${Math.abs(trend.value)}% ${
                trend.isPositive ? "increase" : "decrease"
              }`}>
              <div className='trend-indicator'>
                {trend.isPositive ? (
                  <ArrowUpOutlined style={{ color: "#52c41a" }} />
                ) : (
                  <ArrowDownOutlined style={{ color: "#ff4d4f" }} />
                )}
                <span
                  style={{
                    color: trend.isPositive ? "#52c41a" : "#ff4d4f",
                    marginLeft: 4,
                  }}>
                  {Math.abs(trend.value)}%
                </span>
              </div>
            </Tooltip>
          )}
        </div>
        <div className='card-icon-container'>
          <Icon size={24} style={{ color: "#4F46E5" }} />
        </div>
      </Space>
    </Card>
  );
};

export default DashboardCard;
