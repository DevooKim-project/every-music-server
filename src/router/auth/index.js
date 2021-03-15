const express = require("express");
const googleRoute = require("./google");
const kakaoRoute = require("./kakao");
const spotifyRoute = require("./spotify");

const router = express.Router();

router.use("/google", googleRoute);
router.use("/kakao", kakaoRoute);
router.use("/spotify", spotifyRoute);

module.exports = router;
