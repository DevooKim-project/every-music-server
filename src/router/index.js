const express = require("express");

const authRoute = require("./auth");
const playListRoute = require("./playlist");
const boardRoute = require("./board");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("home");
});

router.use("/auth", authRoute);
router.use("/playList", playListRoute);
router.use("/board", boardRoute);

router.use((req, res) => {
  res.status(404).send("Bad request");
});

module.exports = router;
