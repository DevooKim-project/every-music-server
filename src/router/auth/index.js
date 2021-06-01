const express = require("express");

const { tokenTypes, authTypes } = require("../../config/type");
const verifyToken = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const authValidation = require("../../validate/AuthValidation");
const controller = require("./controller");

const router = express.Router();

router.param("platform", validate(authValidation.oAuthPlatform));

router.get("/:platform", verifyToken(tokenTypes.ACCESS), controller.getPlatformToken);

router.post("/:platform/refresh", verifyToken(tokenTypes.ACCESS), controller.refreshPlatformToken);

router.post("/:platform/login", validate(authValidation.oAuthToken), controller.login);

router.delete("/logout", controller.logout);

router.post("/:platform/token", verifyToken(tokenTypes.REFRESH), controller.generatePlatformToken);

router.post("/login", verifyToken(tokenTypes.REFRESH, false), controller.loginWithUserId);

router.delete("/", verifyToken(tokenTypes.ACCESS), controller.signOut);

router.post("/refresh", verifyToken(tokenTypes.ACCESS), controller.loginWithUserId);

module.exports = router;
