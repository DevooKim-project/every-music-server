const jwt = require("jsonwebtoken");
const {
  parseToken,
  localService,
  googleService,
  spotifyService,
} = require("../services/auth");
const { userService } = require("../services/database");

exports.isAccessToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    req.authorization = authorization;
    this.verifyToken(req, res, next);
    // return next();
  } else {
    res.status(419).send("유효하지 않은 access token");
  }
};

exports.isRefreshToken = (req, res, next) => {
  // const cookie = req.signedCookies;
  const cookie = req.cookies;
  const authorization = cookie.refresh_token;
  if (authorization) {
    req.authorization = authorization;
    this.verifyToken(req, res, next);
    // return next();
  } else {
    return res.status(419).send("유효하지 않은 refresh token");
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    const authorization = req.authorization;
    const token = parseToken(authorization);

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);
    req.payload = payload;

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(419).send("토큰 만료");
    }

    return res.status(401).send("유효하지 않은 토큰");
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const type = req.params.type.toLowerCase();
    const user_id = req.payload.id;

    if (type === "google") {
      await googleService.updateRefreshToken(user_id);
      return res.status(201).send("google access_token refresh ok");
    }
    if (type === "spotify") {
      await spotifyService.updateRefreshToken(user_id);
      return res.status(201).send("spotify access_token refresh ok");
    }
    if (type === "local") {
      return next();
    }
    return res.status(404).json({ message: "refresh Token Type Error" });
  } catch (error) {
    res.status(error.code).json(error.message);
    // res.send(error);
    // console.error(error);
    // return next(err);
  }
};

exports.createLocalToken = async (req, res, next) => {
  try {
    const payload = req.payload;
    const user_id = payload ? payload.id : req.user_id;
    const user = await userService.findOneUser({ _id: user_id });
    const local_token = await localService.createToken(user);

    console.log("local access_token: ", local_token.access_token);
    console.log("local refresh_token: ", local_token.refresh_token);

    res.clearCookie("refresh_token");
    res.cookie("refresh_token", local_token.refresh_token, {
      // httpOnly: true, //JS에서 쿠키 접근 불가능
      // secure: true, //https에서만 쿠키 생성
      // expires: new Date(Date.now() + 2592000) //unixTime: 1month
      // signed: true,
    });
    req.local_access_token = local_token.access_token;
    //TODO: redirect 고려
    res.send(local_token.access_token);
  } catch (error) {
    console.error(error);
    res.send(error);
    // return next(err);
  }
};
