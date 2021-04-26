const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");

const { tokenTypes } = require("../config/type");
const ApiError = require("../utils/ApiError");
const parseToken = require("../utils/parseToken");

const verifyToken = (type, required = true) => (req, res, next) => {
  try {
    let token = "";
    if (type === tokenTypes.ACCESS) {
      token = parseToken(req.headers.authorization);
    }
    if (type === tokenTypes.REFRESH) {
      token = parseToken(req.signedCookies.refreshToken);
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("payload: ", payload);
    req.payload = payload;
    next();
  } catch (error) {
    if (!required) {
      return next();
    }

    if (error.name === "TokenExpiredError") {
      throw new ApiError(419, "Expired token");
    }
    throw new ApiError(httpStatus.UNAUTHORIZED, "Not found token");
  }
};

module.exports = verifyToken;
