const express = require("express");
const {
  isRefreshToken,
  refreshToken,
  createLocalToken,
  verifyToken,
} = require("../../middleware/auth");
const googleRoute = require("./google");
const kakaoRoute = require("./kakao");
const spotifyRoute = require("./spotify");

const router = express.Router();

router.use("/google", googleRoute);
router.use("/kakao", kakaoRoute);
router.use("/spotify", spotifyRoute);

router.get("/refresh/:type", isRefreshToken, refreshToken, createLocalToken);

module.exports = router;
