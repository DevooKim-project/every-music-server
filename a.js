const express = require("express");
const router = express.Router();
const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;

passport.use(
  "kakao",
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_ID,
      callbackURL: "/auth/kakao/callback", // 위에서 설정한 Redirect URI
    },
    async (accessToken, refreshToken, profile, done) => {
      //console.log(profile);
      console.log(accessToken);
      console.log(refreshToken);
    }
  )
);

router.get("/", passport.authenticate("kakao"));

router.get(
  "/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (res, req) => {
    res.redirect("/");
  }
);

module.exports = router;
