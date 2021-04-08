const express = require("express");

const auth = require("../../../middleware/auth");
const controller = require("./controller");

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

module.exports = router;
