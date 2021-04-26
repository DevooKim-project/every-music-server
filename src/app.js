const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const httpStatus = require("http-status");

const apiRouter = require("./router");
const configs = require("./config");
const ApiError = require("./utils/ApiError");
const { errorConverter, errorHandler } = require("./middleware/error");

const app = express();

configs();

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

app.use("/", apiRouter);
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorConverter);
app.use(errorHandler);

app.listen(app.get("port"), () => {
  console.log("port open" + app.get("port"));
  console.log(process.env.NODE_ENV);
});
