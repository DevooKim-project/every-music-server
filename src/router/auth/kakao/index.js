const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/", passport.authenticate("kakao"));

router.get(
  "/callback",
  passport.authenticate("kakao", {
    successRedirect: "/",
    failureRedirect: "/re",
  })
  // (res, req) => {
  // res.redirect("/");
  // res.send("home2");
  // }
);

router.get("/logout", (req, res) => {});

module.exports = router;
