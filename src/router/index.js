const express = require("express");

const authRoute = require("./auth");
const convertRoute = require("./convert");
const boardRoute = require("./board");

const router = express.Router();

router.get("/", (req, res) => {
  res.cookie("name", "test", { signed: true });
  res.send("dd");
});

router.use("/auth", authRoute);
router.use("/convert", convertRoute);
router.use("/board", boardRoute);

router.use((req, res) => {
  res.status(404).send("Bad request");
});

module.exports = router;
