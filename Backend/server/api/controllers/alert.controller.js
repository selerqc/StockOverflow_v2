const AlertService = require("../../services/alert.service");

const AlertsController = {
  GetAllAlerts: async (req, res) => {
    try {
      const result = await AlertService.getAllAlerts();
      
      res.status(200).json({
        status: "success",
        message: "Alerts retrieved successfully",
        data: result.alerts,
        unreadAlerts: result.unreadAlerts,
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
    const unreadCount = await AlertService.getUnreadCount();

    res.status(200).json({
      status: "Unread Count",
      unreadCount,
    });
  },

  AddNewAlert: async (req, res) => {
    try {
      const addAlert = await AlertService.addNewAlert(req.body, req.user._id);

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
      const updateAlert = await AlertService.updateAlert(req.params.id, req.body);

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
      const updatedAlerts = await AlertService.updateManyAlerts(ids);

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
      const deleteResult = await AlertService.deleteAllAlerts(req.user._id);

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
