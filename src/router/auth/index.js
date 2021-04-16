const express = require("express");

const { tokenTypes, authTypes } = require("../../config/type");
const verifyToken = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const authValidation = require("../../validate/AuthValidation");
const controller = require("./controller");

const router = express.Router();

router.param(
  "platform",
  validate(authValidation.oAuthPlatform),
  (req, res, next, id) => {
    next();
  }
);

router.get("/:platform/login", controller.obtainOAuth(authTypes.LOGIN));
router.get("/:platform/login/callback", controller.login);

router.get("/:platform/token", controller.obtainOAuth(authTypes.TOKEN));
router.get(
  "/:platform/token/callback",
  // verifyToken(tokenTypes.ACCESS),
  verifyToken(tokenTypes.REFRESH),
  controller.getOnlyPlatformToken
);

router.get(
  "/login/direct",
  verifyToken(tokenTypes.REFRESH),
  controller.loginWithUserId
);

router.get("/sign-out", verifyToken(tokenTypes.ACCESS), controller.signOut);
// router.get("/sign-out", verifyToken(tokenTypes.REFRESH), controller.signOut);

// router.put("/:platform/refresh", isRefreshToken, refreshToken, createLocalToken);

module.exports = router;
