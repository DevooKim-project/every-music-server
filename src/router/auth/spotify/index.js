const express = require("express");
const auth = require("../../../middleware/auth");
const controller = require("./controller");

const router = express.Router();

router.post("/", controller.withLogin, controller.obtainOAuth);
router.get(
  "/callback",
  controller.withLogin,
  controller.getProviderToken,
  controller.login,
  auth.createLocalToken
);

router.post("/token", controller.withoutLogin, controller.obtainOAuth);
router.get(
  "/callback2",
  auth.isAccessToken,
  controller.withoutLogin,
  controller.saveTokenWithoutLogin
);
router.delete("/signOut", auth.isAccessToken, controller.signOut);

module.exports = router;
