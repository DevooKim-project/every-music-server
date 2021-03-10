const { default: axios } = require("axios");
const express = require("express");
const passport = require("passport");
const getToken = require("./controller");

const router = express.Router();

router.get("/", passport.authenticate("kakao", { session: false }));

router.get(
  "/callback",
  passport.authenticate("kakao", { session: false }),
  getToken
  // (req, res) => {
  //   res.redirect("/auth/login");
  // }
);

router.get("/logout", (req, res) => {
  res.send("not yet");
});

module.exports = router;
