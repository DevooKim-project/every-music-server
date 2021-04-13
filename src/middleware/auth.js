const { tokenTypes } = require("../config/type");

const verifyToken = (type, required = true) => (req, res, next) => {
  try {
    let token = "";
    if (type === tokenTypes.ACCESS) {
      token = req.headers.authorization;
    } else if (type === tokenTypes.REFRESH) {
      token = req.cookies.refreshToken;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
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
