const express = require("express");
const authRoute = require("./auth");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("home");
});
router.use("/auth", authRoute);

router.get("/test", (req, res) => {
  res.send("test");
});

router.get("/re", (req, res) => {
  res.redirect("/test");
});

router.get("/logout", (req, res) => {
  res.send("logout");
});
router.use((req, res) => {
  res.status(404).send("Bad request");
});

module.exports = router;
