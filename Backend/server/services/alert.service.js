const mongoose = require("mongoose");
const alertModel = require("../models/alert.model");

const AlertService = {
  async getAllAlerts() {
    try {
      const alerts = await alertModel.find();
      const transformedAlerts = alerts.map((alert) => ({
        ...alert.toObject(),
        createdAt: new Date(alert.createdAt).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      }));
      const getUnreadAlerts = await alertModel.countDocuments({
        is_read: false,
      });

      return {
        alerts: transformedAlerts,
        unreadAlerts: getUnreadAlerts,
      };
    } catch (error) {
      throw error;
    }
  },

  async getUnreadCount() {
    return await alertModel.countDocuments({
      is_read: false,
    });
  },

  async addNewAlert(alertData, userId) {
    try {
      console.log(userId); 
      const { type, message, priority, date } = alertData;

      return await alertModel.create({
     
        type,
        message,
        date: date,
        is_read: false,
        priority: priority,
      });
    } catch (error) {
      throw error;
    }
  },

  async updateAlert(alertId, updateData) {
    try {
      const { is_read } = updateData;

      return await alertModel.findOneAndUpdate(
        { _id: alertId },
        {
          is_read: is_read,
        },
        {
          new: true,
        }
      );
    } catch (error) {
      throw error;
    }
  },

  async updateManyAlerts(alertIds) {
    try {
      return await alertModel.updateMany(
        { _id: { $in: alertIds } },
        { is_read: true },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  },

  async deleteAllAlerts(userId) {
    try {
      return await alertModel.deleteMany({
        user_id: userId,
      });
    } catch (error) {
      throw error;
    }
  },
};

module.exports = AlertService;