const express = require("express");

const { tokenTypes, authTypes } = require("../../config/type");
const verifyToken = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const authValidation = require("../../validate/AuthValidation");
const controller = require("./controller");

const router = express.Router();

router.param("platform", validate(authValidation.oAuthPlatform));

router.post("/:platform/login", controller.obtainOAuth(authTypes.LOGIN));
router.get("/:platform/login/callback", controller.login);

router.post("/:platform/token", controller.obtainOAuth(authTypes.TOKEN));
router.get("/:platform/token/callback", verifyToken(tokenTypes.REFRESH), controller.getOnlyPlatformToken);

router.post("/login/direct", verifyToken(tokenTypes.REFRESH), controller.loginWithUserId);

router.delete("/:platform/sign-out", verifyToken(tokenTypes.ACCESS), controller.signOut);

module.exports = router;
