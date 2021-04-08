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
  "/callback2",
  auth.isAccessToken,
  controller.withoutLogin,
  controller.saveTokenWithoutLogin
);
router.get("/signOut", auth.isAccessToken, controller.signOut);

module.exports = router;
