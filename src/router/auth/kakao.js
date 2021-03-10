const { default: axios } = require("axios");
const express = require("express");
const passport = require("passport");
const getToken = require("./controller");
const { verifyToken } = require("../../middleware/auth");

const router = express.Router();

router.get("/", passport.authenticate("kakao", { session: false }));

router.get(
  "/callback",
  passport.authenticate("kakao", { session: false }),
  getToken
);

router.get("/logout", (req, res) => {
  res.send("not yet");
});

module.exports = router;
