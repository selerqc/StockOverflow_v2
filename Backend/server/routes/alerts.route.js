const express = require("express");
const auth = require("../middleware/auth");

const addAlerts = require("../modules/alerts/controllers/addAlerts");
const getAlerts = require("../modules/alerts/controllers/getAlerts");
const updateOneAlert = require("../modules/alerts/controllers/updateOneAlert");
const updateManyAlert = require("../modules/alerts/controllers/updateManyAlert");
const getUnreadCount = require("../modules/alerts/controllers/getUnreadCount");
const deleteManyAlerts = require("../modules/alerts/controllers/deleteManyAlerts");

const alertsRoute = express.Router();

alertsRoute.use(auth);

alertsRoute.post("/addAlerts", addAlerts);
alertsRoute.get("/getAlerts", getAlerts);
alertsRoute.patch("/updateOneAlert/:id", updateOneAlert);
alertsRoute.patch("/updateManyAlert", updateManyAlert);
alertsRoute.get("/getUnreadCount", getUnreadCount);
alertsRoute.delete("/deleteManyAlerts", deleteManyAlerts);

module.exports = alertsRoute;
