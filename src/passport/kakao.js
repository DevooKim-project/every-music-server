const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const User = require("../models/user");

module.exports = () => {
  passport.use(
    "kakao",
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("accessToken", accessToken);
        console.log("kakao", profile);

        // try{
        //   const exUser = await User.findOne({
        //     where:
        //   })
        // }
        // done(error);
        done(null, false);
      }
    )
  );
};
