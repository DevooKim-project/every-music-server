const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;

// const { createUser, findOneUser } = require("../services/user");
const { userService } = require("../services/database");

module.exports = () => {
  passport.use(
    "kakao",
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        // clientSecret: clientSecret, // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
        callbackURL: "/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("kakao", accessToken);
          console.log("kakao2", refreshToken);
          // const exUser = await findOneUser({
          const exUser = await userService.findOneUser({
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
            // const newUser = await createUser({
            const newUser = await userService.createUser({
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
