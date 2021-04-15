const express = require("express");

const verifyToken = require("../../../middleware/auth");
const controller = require("./controller");
const { authTypes, tokenTypes } = require("../../../config/type");

const router = express.Router();

router.get(
  "/login/direct",
  verifyToken(tokenTypes.REFRESH),
  controller.loginDirect
);

router.get("/login", controller.obtainOAuth(authTypes.LOGIN));
router.get("/login/callback", controller.login(authTypes.LOGIN));

router.get(
  "/token",
  // verifyToken(tokenTypes.ACCESS),
  controller.obtainOAuth(authTypes.TOKEN)
);

router.get(
  "/token/callback",
  verifyToken(tokenTypes.REFRESH),
  controller.getOnlyToken(authTypes.TOKEN)
);

router.get("/signOut", verifyToken(tokenTypes.ACCESS), controller.signOut);

module.exports = router;
