const express = require("express");
const googleRoute = require("./google");
const kakaoRoute = require("./kakao");

const router = express.Router();

router.use("/google", googleRoute);
router.use("/kakao", kakaoRoute);

module.exports = router;
