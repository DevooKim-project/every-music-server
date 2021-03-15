const express = require("express");
const authRoute = require("./auth");
const User = require("../database/models/user");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("home");
});
router.use("/auth", authRoute);

router.use((req, res) => {
  res.status(404).send("Bad request");
});

module.exports = router;
