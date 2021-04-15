const express = require("express");

const { tokenTypes } = require("../../config/type");
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

router.get("/:platform/login", controller.obtainOAuth);
router.get("/:platform/login/callback", controller.login);

router.get("/:platform/token");

router.get(
  "/login/direct",
  verifyToken(tokenTypes.REFRESH),
  controller.loginWithUserId
);

// router.put("/:platform/refresh", isRefreshToken, refreshToken, createLocalToken);

module.exports = router;
