const express = require("express");

const auth = require("../../../middleware/auth");
const validate = require("../../../middleware/validate");
const controller = require("./controller");
const authValidation = require("../../../validate/authValidation");

const router = express.Router();

router.get("/", controller.withLogin, controller.obtainOAuth);
router.get(
  "/callback",
  controller.withLogin,
  controller.getProviderToken,
  controller.login,
  auth.createLocalToken
);

router.get("/token", controller.withoutLogin, controller.obtainOAuth);
router.get(
  "/callbackToken",
  auth.isAccessToken,
  controller.withoutLogin,
  controller.getProviderToken,
  controller.saveTokenWithoutLogin
);

router.delete("/signOut", auth.isAccessToken, controller.signOut);

//로그아웃은 클라이언트에서 jwt제거

router.get("/:type", controller.obtainOAuth);
router.get("/callback", controller.OAuthCallback);
router.get("/callbackToken", controller.OAuthCallbackToken);
router.get("/signOut", validate(authValidation.oAuthType), controller.signOut);

module.exports = router;
