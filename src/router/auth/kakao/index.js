const express = require("express");
const passport = require("passport");

const { getToken, refreshToken, logout, signout } = require("./controller");
const { verifyToken } = require("../../../middleware/auth");

const router = express.Router();

router.get("/", passport.authenticate("kakao", { session: false }));

router.get(
  "/callback",
  passport.authenticate("kakao", { session: false }),
  getToken
);

router.get("/refresh", verifyToken, refreshToken);

router.get("/logout", verifyToken, logout);

router.get("/signout", signout);

module.exports = router;
