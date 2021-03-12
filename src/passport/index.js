const kakao = require("./kakao");
const passport = require("passport");
const User = require("../database/models/user");

module.exports = () => {
  // passport.serializeUser((user, done) => {
  //   done(null, user.id);
  // });

  // passport.deserializeUser((id, done) => {
  //   User.findOne({ where: { id } })
  //     .then((user) => done(null, user))
  //     .catch((err) => done(err));
  // });
  kakao();
};
