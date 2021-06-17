const express = require("express");

const authRoute = require("./auth");
const convertRoute = require("./convert");
const playlistRoute = require("./playlist");
const userRoute = require("./user");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/convert", convertRoute);
router.use("/playlist", playlistRoute);
router.use("/user", userRoute);

const test = (req, res, next) => {
  console.log("test1");
  next();
};

const test2 = (req, res, next) => {
  console.log("test2");
  next();
};

router.use("/:id", test, test2);

router.get("/test/:id", (req, res) => {
  console.log("test3");
  res.send(req.params);
});
module.exports = router;
