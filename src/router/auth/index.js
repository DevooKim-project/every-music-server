const express = require("express");
const googleRoute = require("./google");
const kakaoRoute = require("./kakao");
const { isLoggedIn, isNotLoggedIn } = require("../../middleware/login");

const router = express.Router();

router.use(isNotLoggedIn);

router.use("/google", googleRoute);
router.use("/kakao", kakaoRoute);

module.exports = router;
