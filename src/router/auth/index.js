const express = require("express");
// const {
//   isRefreshToken,
//   refreshToken,
//   createLocalToken,
// } = require("../../middleware/auth");
// const googleRoute = require("./google");
// const kakaoRoute = require("./kakao");
// const spotifyRoute = require("./spotify");
const controller = require("./controller");

const router = express.Router();

router.get("/:type/login", controller.obtainOAuth);
router.get("/:type/login/callback", controller.login);

// router.put("/:type/refresh", isRefreshToken, refreshToken, createLocalToken);

module.exports = router;
