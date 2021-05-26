const express = require("express");
const logger = require("../config/logger");

const authRoute = require("./auth");
const convertRoute = require("./convert");
const playlistRoute = require("./playlist");
const trackRoute = require("./track");
const userRoute = require("./user");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/convert", convertRoute);
router.use("/playlist", playlistRoute);
router.use("/track", trackRoute);
router.use("/user", userRoute);

router.get("/", (req, res) => {
  logger.info("infoTest");
  logger.error("error Test");
  res.send("d");
});

module.exports = router;
