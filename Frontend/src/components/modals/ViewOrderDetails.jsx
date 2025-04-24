import React from "react";
import { Modal, Descriptions, Button } from "antd";

const ViewOrderDetails = ({ order, visible, onClose }) => {
  if (!order) return null;

  return (
    <Modal
      title='Order Details'
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key='close' onClick={onClose}>
          Close
        </Button>,
      ]}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label='Product Name'>{order.name}</Descriptions.Item>
        <Descriptions.Item label='Quantity'>
          {order.stock_level}
        </Descriptions.Item>
        <Descriptions.Item label='Total Price'>
          ${order.total_price.toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label='Status'>{order.status}</Descriptions.Item>
        <Descriptions.Item label='Order Date'>
          {order.createdAt}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ViewOrderDetails;
