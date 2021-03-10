const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const User = require("../models/user");
const axios = require("axios");

module.exports = () => {
  passport.use(
    "kakao",
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("kakao", accessToken);
          console.log("kakao2", refreshToken);
          const exUser = await User.findOne({
            where: { provider: "kakao", providerId: profile.id },
          });

          if (exUser) {
            done(null, exUser);
          } else {
            const email = profile._json.kakao_account.email;
            const id = profile._json.id;
            const nick = email.replace(/@[\w\.]*/g, "");
            const newUser = await User.create({
              email,
              nick,
              provider: "kakao",
              providerId: id,
            });

            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
