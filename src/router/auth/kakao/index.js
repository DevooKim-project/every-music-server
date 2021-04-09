const express = require("express");

const auth = require("../../../middleware/auth");
const controller = require("./controller");

const router = express.Router();

router.get("/", controller.obtainOAuth);
router.get(
  "/callback",
  controller.getProviderToken,
  controller.login,
  auth.createLocalToken
);
router.post("/logout", controller.logout);
router.delete("/signOut", auth.isAccessToken, controller.signOut);

module.exports = router;
