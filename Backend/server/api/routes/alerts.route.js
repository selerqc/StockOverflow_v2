const express = require("express");
const auth = require("../middleware/auth");

const Alerts = require("../controllers/alert.controller");

const alertsRoute = express.Router();

alertsRoute.post("/addAlerts", Alerts.AddNewAlert)

alertsRoute.use(auth);

alertsRoute
  .get("/getAlerts", Alerts.GetAllAlerts)
  .patch("/updateOneAlert/:id", Alerts.UpdateOneAlert)
  .patch("/updateManyAlert", Alerts.UpdateManyAlert)
  .get("/getUnreadCount", Alerts.GetUnreadCount)
  .delete("/deleteManyAlerts", Alerts.DeleteManyAlert);

module.exports = alertsRoute;
