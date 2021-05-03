const express = require("express");

const { tokenTypes, authTypes } = require("../../config/type");
const verifyToken = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const authValidation = require("../../validate/AuthValidation");
const controller = require("./controller");

const router = express.Router();

router.param("platform", validate(authValidation.oAuthPlatform));

router.get("/:platform/login", controller.obtainOAuth(authTypes.LOGIN));
// router.post("/:platform/login", controller.obtainOAuth(authTypes.LOGIN));
router.post("/:platform/login/callback", controller.login);

router.get("/:platform/token", controller.obtainOAuth(authTypes.TOKEN));
// router.post("/:platform/token", controller.obtainOAuth(authTypes.TOKEN));
router.post("/:platform/token/callback", verifyToken(tokenTypes.REFRESH), controller.getOnlyPlatformToken);

router.post("/login", verifyToken(tokenTypes.REFRESH), controller.loginWithUserId);

router.delete("/:platform/sign-out", verifyToken(tokenTypes.ACCESS), controller.signOut);

router.post("/refresh", verifyToken(tokenTypes.ACCESS), controller.loginWithUserId);

module.exports = router;
