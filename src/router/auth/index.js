const express = require("express");
const googleRoute = require("./google");
const kakaoRoute = require("./kakao");
// const tokenRoute = require("./controller");
const { verifyToken } = require("../../middleware/auth");
// const { isLoggedIn, isNotLoggedIn } = require("../../middleware/auth");

const router = express.Router();

// router.use(isNotLoggedIn);

router.use("/google", googleRoute);
router.use("/kakao", kakaoRoute);

module.exports = router;
