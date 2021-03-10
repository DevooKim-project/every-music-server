const express = require("express");
const passport = require("passport");

const { getToken, refreshToken, logout } = require("./controller");
const { verifyToken } = require("../../../middleware/auth");

const router = express.Router();

router.get("/", passport.authenticate("kakao", { session: false }));

router.get(
  "/callback",
  passport.authenticate("kakao", { session: false }),
  getToken
);

router.get("/refresh", verifyToken, refreshToken);

router.get("/logout", logout);

router.delete("/signout");

module.exports = router;
