const express = require("express");

const authRoute = require("./auth");
const playlistRoute = require("./playlist");
const boardRoute = require("./board");

const router = express.Router();

router.get("/", (req, res) => {
  res.cookie("name", "test", { signed: true });
  res.send("dd");
});
router.get("/test", (req, res) => {
  const test = req.signedCookies;
  res.send(test);
});

router.get("/test1", (req, res) => {
  req.test = "test";
  res.redirect("http://localhost:5000/test2");
});

router.get("/test2", (req, res) => {
  console.log(req.test);
  res.send(req.test);
});
router.use("/auth", authRoute);
router.use("/playlist", playlistRoute);
router.use("/board", boardRoute);

router.use((req, res) => {
  res.status(404).send("Bad request");
});

module.exports = router;
