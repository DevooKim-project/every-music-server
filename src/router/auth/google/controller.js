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

exports.getLocalToken = async (req, res) => {
  try {
    // const { access_token, refresh_token, id_token } = req.tokens;
    const tokens = await googleService.getToken(req.query.code);

    //refresh_token은 최초 1회 발급
    const { access_token, refresh_token, id_token } = tokens;
    const profile = jwt.decode(id_token);

    const exUser = await userService.findOneUser({
      provider: "google",
      providerId: profile.sub,
    });

    if (exUser) {
      const localToken = localService.createToken(exUser);
      await tokenService.updateToken({
        userId: exUser.id,
        accessToken: access_token,
      });
      console.log("exUser");
      return res.send(localToken);
    }

    console.log("newUser");
    //유저 생성
    const newUser = await userService.createUser({
      email: profile.email,
      nick: profile.name,
      providerId: profile.sub,
      provider: "google",
    });

    //로컬 토큰 발급
    const localToken = localService.createToken(newUser);

    //access토큰, refresh토큰 저장
    await tokenService.storeToken({
      userId: newUser.id,
      accessToken: access_token,
      refreshToken: refresh_token,
    });

    return res.send(localToken);
  } catch (error) {
    console.error(error);
    return res.send(error);
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const type = req.params.type;

    switch (type) {
      case "local":
        const newToken = await localService.refreshToken(
          req.headers.authorization
        );
        return res.send(newToken);

      case "provider":
        await googleService.refreshToken(req.headers.authorization);
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

    //refresh 토큰 검색
    const refreshToken = await tokenService.findRefreshToken(userId);
    //토큰 만료 요청 보냄
    await axios({
      method: "POST",
      url: "https://oauth2.googleapis.com/revoke",
      params: {
        token: refreshToken,
      },
    });
    //토큰 제거
    await tokenService.deleteToken(userId);
    //유저 제거
    await userService.destroyUser({ id: userId });

    return res.send("signout ok");
  } catch (error) {
    console.error(error);
    return res.send(error);
  }
};
