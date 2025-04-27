const mongoose = require("mongoose");
const alertModel = require("../models/alert.model");
const AlertsController = {
  GetAllAlerts: async (req, res) => {
    try {
      const alerts = await alertModel
        .find({
          user_id: req.user._id,
        })
        .select({
          _v: 0,
        });

      const getUnreadAlerts = await alertModel.countDocuments({
        is_read: false,
        user_id: req.user._id,
      });

      res.status(200).json({
        status: "success",
        message: "Alerts retrieved successfully",
        data: alerts,
        unreadAlerts: getUnreadAlerts,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  GetUnreadCount: async (req, res) => {
    try {
      const unreadCount = await alertModel.countDocuments({
        user_id: req.user._id,
        is_read: false,
      });
      res.status(200).json({
        status: "Unread Count",
        unreadCount,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  AddNewAlert: async (req, res) => {
    try {
      const { type, message, priority, date } = req.body;

      const addAlert = await alertModel.create({
        user_id: req.user._id,
        type,
        message,
        date: date,
        is_read: false,
        priority: priority,
      });

      res.status(201).json({
        status: "success",
        message: "Alert added successfully",
        addAlert,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  UpdateOneAlert: async (req, res) => {
    try {
      const { is_read } = req.body;

      const updateAlert = await alertModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          is_read: is_read,
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        status: "success",
        message: "Alert updated successfully",
        updateAlert,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  UpdateManyAlert: async (req, res) => {
    try {
      const { ids } = req.body;

      const updatedAlerts = await alertModel.updateMany(
        { _id: { $in: ids } },
        { is_read: true },
        { new: true }
      );

      res.status(200).json({
        status: "success",
        message: "Alerts updated successfully",
        updatedAlerts,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  DeleteManyAlert: async (req, res) => {
    try {
      const deleteResult = await alertModel.deleteMany({
        user_id: req.user._id,
      });

      res.status(200).json({
        status: "success",
        message: "Alerts deleted successfully",
        deleteResult,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },
};

module.exports = AlertsController;
