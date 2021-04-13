const express = require("express");

const authRoute = require("./auth");
const convertRoute = require("./convert");
const playlistRoute = require("./playlist");
const userRoute = require("./user");
const trackRoute = require("./track");

const router = express.Router();

const User = require("../database/schema/user");

router.get("/", async (req, res) => {
  const email = "khwoo8026@naver.com";
  const test = await User.isEmailTaken(email);
  console.log(test);
  res.send(test);
});

router.use("/auth", authRoute);
router.use("/convert", convertRoute);
router.use("/playlist", playlistRoute);
router.use("/track", trackRoute);
router.use("/user", userRoute);

// router.use((req, res) => {
//   res.status(404).send("Bad request");
// });

module.exports = router;
