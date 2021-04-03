const axios = require("axios");
const jwt = require("jsonwebtoken");
const qs = require("qs");
const { parseToken } = require("../../../middleware/auth");

const { localService, googleService } = require("../../../services/auth");
const { userService, tokenService } = require("../../../services/database");

exports.login = async (req, res) => {
  const url = "https://accounts.google.com/o/oauth2/v2/auth";
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl",
    "https://www.googleapis.com/auth/youtube",
  ];

  const params = {
    client_id: process.env.GOOGLE_ID,
    redirect_uri: "http://localhost:5000/auth/google/callback",
    response_type: "code",
    access_type: "offline",
    scope: scopes.join(" "),
  };

  return res.redirect(`${url}?${qs.stringify(params)}`);
};

exports.getProviderToken = async (req, res, next) => {
  try {
    const tokens = await googleService.getToken(req.query.code);
    req.tokens = tokens;
    next();
  } catch (error) {
    res.send(error);
  }
};

exports.getLocalToken = async (req, res) => {
  try {
    const tokens = req.tokens;

    //refresh_token은 최초 1회 발급
    const { access_token, refresh_token, id_token } = tokens;
    const profile = jwt.decode(id_token);
    const provider = {
      provider: "google",
      providerId: profile.id,
    };

    const exUser = await userService.findOneUser({ email: profile.email });

    if (exUser) {
      if (exUser.provider === provider) {
        console.log("exUser");
        const localToken = localService.createToken(exUser);
        await tokenService.updateToken({
          user: exUser.id,
          accessToken: access_token,
          provider: "google",
        });
        return res.send(localToken);
      } else {
        return res.send(`${exUser.provider.provider}로 가입된 계정 입니다.`);
      }
    }

    console.log("newUser");
    //유저 생성
    const newUser = await userService.createUser({
      email: profile.email,
      nick: profile.name,
      provider: {
        provider: "google",
        providerId: profile.sub,
      },
    });

    //로컬 토큰 발급
    const localToken = localService.createToken(newUser);

    //access토큰, refresh토큰 저장
    await tokenService.storeToken({
      user: newUser.id,
      provider: "google",
      accessToken: access_token,
      refreshToken: refresh_token,
    });

    return res.send(localToken);
  } catch (error) {
    if (error.code === 11000) {
      return res.send("이미 가입된 유저");
    }
    return res.send(error);
  }
};

exports.updateRefreshToken = async (req, res) => {
  try {
    const type = req.params.type;

    switch (type) {
      case "local":
        const newToken = await localService.updateRefreshToken(
          req.headers.authorization
        );
        return res.send(newToken);

      case "provider":
        await googleService.updateRefreshToken(req.headers.authorization);
        return res.send("google refresh ok");

      default:
        throw new Error("token type error");
    }
  } catch (error) {
    console.error(error);
    return res.send(error);
  }
};

exports.singout = async (req, res) => {
  try {
    const localToken = parseToken(req.headers.authorization);
    const payload = jwt.verify(localToken, process.env.JWT_SECRET);
    const userId = payload.id;

    //토큰 검색
    const token = await tokenService.findToken({
      userId: userId,
      provider: "google",
    });

    const params = {
      token: token.refreshToken,
    };
    const options = {
      method: "POST",
      url: "https://oauth2.googleapis.com/revoke",
      params,
    };

    Promise.all([
      axios(options),
      tokenService.deleteToken(userId),
      userService.destroyUser(userId),
    ]);

    return res.send("signout ok");
  } catch (error) {
    return res.send(error);
  }
};
