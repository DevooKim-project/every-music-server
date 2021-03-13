const jwt = require("jsonwebtoken");
const queryString = require("querystring");

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

  res.redirect(`${url}?${queryString.stringify(params)}`);
};

exports.getLocalToken = async (req, res) => {
  try {
    // const { access_token, refresh_token, id_token } = req.tokens;
    const tokens = googleService.getToken(req.query.code);
    const { access_token, refresh_token, id_token } = tokens;
    const profile = jwt.decode(id_token);

    const user = {
      email: profile.email,
      nick: profile.name,
      providerId: profile.sub,
      provider: "google",
    };

    //유저 생성
    const newUser = await userService.createUser(user);

    //로컬 토큰 발급
    const localToken = localService.createToken(user);

    //access토큰, refresh토큰 저장
    await tokenService.storeToken({
      userId: newUser.id,
      accessToken: access_token,
      refreshToken: refresh_token,
    });

    res.send(localToken);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const type = req.params.type;

    switch (type) {
      case local:
        const newToken = await localService.refreshToken(
          req.headers.Authorization
        );
        res.send(newToken);
        break;

      case provider:
        await googleService.refreshToken(req.headers.Authorization);
        res.send("google refresh ok");
        break;

      default:
        throw new Error("token type error");
    }
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};
