const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const envConfig = require("./config/envConfig");
const apiRouter = require("./router");
const { sequelize } = require("./models");
const passportConfig = require("./passport");
const oAuthConfig = require("./oAuth");

const app = express();

envConfig();
sequelize
  .sync({ force: true })
  .then(() => {
    console.log("mysql connect ok");
  })
  .catch((err) => {
    console.error(err);
  });

app.set("port", process.env.PORT || 8001);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(
//   session({
//     resave: false,
//     saveUninitialized: false,
//     secret: process.env.COOKIE_SECRET,
//     cookie: {
//       httpOnly: true,
//       secure: false,
//     },
//   })
// );

passportConfig();
oAuthConfig();
app.use(passport.initialize());
// app.use(passport.session());

app.use("/", apiRouter);

app.listen(app.get("port"), () => {
  console.log("port open" + app.get("port"));
  console.log(process.env.NODE_ENV);
});
