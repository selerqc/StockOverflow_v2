const express = require("express");
const auth = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");
const { PERMISSIONS } = require("../../config/roles");

const Alerts = require("../controllers/alert.controller");

const alertsRoute = express.Router();

// This endpoint needs auth and manage alerts permission since it's creating alerts
alertsRoute.post("/addAlerts", auth, checkPermission(PERMISSIONS.MANAGE_ALERTS), Alerts.AddNewAlert)

alertsRoute.use(auth);

alertsRoute
  .get("/getAlerts", checkPermission(PERMISSIONS.VIEW_ALERTS), Alerts.GetAllAlerts)
  .patch("/updateOneAlert/:id", checkPermission(PERMISSIONS.MANAGE_ALERTS), Alerts.UpdateOneAlert)
  .patch("/updateManyAlert", checkPermission(PERMISSIONS.MANAGE_ALERTS), Alerts.UpdateManyAlert)
  .get("/getUnreadCount", checkPermission(PERMISSIONS.VIEW_ALERTS), Alerts.GetUnreadCount)
  .delete("/deleteManyAlerts", checkPermission(PERMISSIONS.MANAGE_ALERTS), Alerts.DeleteManyAlert);

module.exports = alertsRoute;
