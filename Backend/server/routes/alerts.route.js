const express = require("express");
const auth = require("../middleware/auth");

const Alerts = require("../modules/alerts/Alerts");

const alertsRoute = express.Router();

alertsRoute.use(auth);

alertsRoute
  .post("/addAlerts", Alerts.AddNewAlert)
  .get("/getAlerts", Alerts.GetAllAlerts)
  .patch("/updateOneAlert/:id", Alerts.UpdateOneAlert)
  .patch("/updateManyAlert", Alerts.UpdateManyAlert)
  .get("/getUnreadCount", Alerts.GetUnreadCount)
  .delete("/deleteManyAlerts", Alerts.DeleteManyAlert);

module.exports = alertsRoute;
