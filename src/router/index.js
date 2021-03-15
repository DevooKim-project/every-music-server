const express = require("express");

const authRoute = require("./auth");
const playListRoute = require("./playlist");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("home");
});

router.use("/auth", authRoute);
router.use("/playListRoute", playListRoute);

router.use((req, res) => {
  res.status(404).send("Bad request");
});

module.exports = router;
