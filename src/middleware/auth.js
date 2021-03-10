const jwt = require("jsonwebtoken");

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.send("로그인한 상태");
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    token = token.replace(/^Bearer\s+/, "");
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(419).send("토큰 만료");
    }

    return res.status(401).send("유효하지 않은 토큰");
  }
};
