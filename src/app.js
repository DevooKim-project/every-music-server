const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const httpStatus = require("http-status");
const helmet = require("helmet");

const apiRouter = require("./router");
const config = require("./config/config");
const ApiError = require("./utils/ApiError");
const { errorConverter, errorHandler } = require("./middleware/error");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(morgan(config.env == "production" ? "combined" : "dev"));
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use(cookieParser(config.cookieSecret));

app.use("/", apiRouter);
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
