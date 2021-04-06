const jwt = require("jsonwebtoken");
const {
  parseToken,
  localService,
  googleService,
  spotifyService,
} = require("../services/auth");
const { userService, tokenService } = require("../services/database");

exports.isAccessToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    req.authorization = authorization;
    next();
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
    return next();
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

    next();
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
    console.log("type: ", type);
    switch (type) {
      case "google":
        await googleService.updateRefreshToken(user_id);
        res.status(201).send("google access_token refresh ok");
        break;
      case "spotify":
        await spotifyService.updateRefreshToken(user_id);
        res.status(201).send("spotify access_token refresh ok");
        break;
      case "local":
        next();
        break;
      default:
        throw new Error({ code: "", message: "refresh Token Type Error" });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.createLocalToken = async (req, res, next) => {
  try {
    const payload = req.payload;
    // const { id } = req.payload;  //4/6 로컬 토큰 변화 문
    console.log("1", payload);
    console.log("2", req.user_id);
    const user_id = payload ? payload.id : req.user_id;
    console.log("user_id: ", user_id);
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
    next();
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
