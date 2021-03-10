const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;

const { createUser, findOneUser } = require("../services/user");

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
          const exUser = await findOneUser({
            provider: "kakao",
            providerId: profile.id,
          });

          if (exUser) {
            done(null, exUser);
          } else {
            const email = profile._json.kakao_account.email;
            const id = "" + profile._json.id; //string으로 통일
            // const nick = email.replace(/@[\w\.]*/g, "");
            const nick = "testNick";
            const newUser = await createUser({
              email,
              nick,
              providerId: id,
              provider: "kakao",
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
