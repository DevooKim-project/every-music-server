const jwt = require("jsonwebtoken");

const { tokenTypes } = require("../config/type");
const parseToken = require("../utils/parseToken");

const verifyToken = (type, required = true) => (req, res, next) => {
  try {
    let token = "";
    if (type === tokenTypes.ACCESS) {
      token = parseToken(req.headers.authorization);
    } else if (type === tokenTypes.REFRESH) {
      token = parseToken(req.cookies.refreshToken);
    }
    console.log("token: ", token);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("payload: ", payload);
    req.payload = payload;
    next();
  } catch (error) {
    if (!required) {
      next();
    }

    if (error.name === "TokenExpiredError") {
      throw new ApiError(419, "Expired token");
    }
    throw new ApiError(httpStatus.UNAUTHORIZED, "Not found token");
  }
};

module.exports = verifyToken;
