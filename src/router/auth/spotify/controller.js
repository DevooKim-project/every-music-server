const qs = require("qs");
const jwt = require("jsonwebtoken");

const { spotifyService, localService } = require("../../../services/auth");
const { userService, tokenService } = require("../../../services/database");
const { parseToken } = require("../../../middleware/auth");

exports.oAuth = async (req, res) => {
  const url = "https://accounts.spotify.com/authorize";
  const scopes = [
    "user-read-email",
    "playlist-modify-public",
    "playlist-modify-private",
    "playlist-read-private",
    // "playlist-read-collaborative",
  ];

  const params = {
    response_type: "code",
    client_id: process.env.SPOTIFY_ID,
    redirect_uri: "http://localhost:5000/auth/spotify/callback",
    scope: scopes.join(" "),
  };

  return res.redirect(`${url}?${qs.stringify(params)}`);
};

exports.getProviderToken = async (req, res, next) => {
  try {
    const token = await spotifyService.getToken(req.query.code);
    req.token = token;
    next();
  } catch (error) {
    console.error(error);
    res.send(error); //확인 필요
  }
};

exports.getLocalToken = async (req, res) => {
  try {
    const { access_token, refresh_token } = req.token;
    console.log("refresh_token: ", refresh_token);
    const profile = await spotifyService.getProfile(access_token);
    const provider = {
      provider: "spotify",
      provider_id: profile.id,
    };

    const exUser = await userService.findOneUser({ email: profile.email });

    if (exUser) {
      if (exUser.provider === provider) {
        console.log("exUser");
        const localToken = localService.createToken(exUser);
        await tokenService.updateToken({
          user: exUser.id,
          access_token: access_token,
          provider: "spotify",
        });
        return res.send(localToken);
      } else {
        return res.send(`${exUser.provider.provider}로 가입된 계정 입니다.`);
      }
    }

    console.log("newUser");
    const newUser = await userService.createUser({
      email: profile.email,
      nick: profile.display_name,
      provider: {
        provider: "spotify",
        provider_id: profile.id,
      },
    });

    const localToken = localService.createToken(newUser);

    await tokenService.storeToken({
      user: newUser.id,
      provider: "spotify",
      access_token: access_token,
      refresh_token: refresh_token,
    });

    return res.send(localToken);
  } catch (error) {
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
        await spotifyService.updateRefreshToken(req.headers.authorization);
        return res.send("spotify refresh ok");

      default:
        throw new Error("token type error");
    }
  } catch (error) {
    console.error(error);
    return res.send(error);
  }
};

exports.signout = async (req, res) => {
  try {
    const localToken = parseToken(req.headers.authorization);
    const payload = jwt.verify(localToken, process.env.JWT_SECRET);
    const userId = payload.id;

    //사용자가 스포티파이에서 직접 토큰 제거해야함(프론트에서 링크 연결) 서버에서는 db에서만 제거
    Promise.all([
      tokenService.deleteToken(userId),
      userService.destroyUser(userId),
    ]);

    return res.send("signout ok");
  } catch (error) {
    console.error(error);
    return res.send(error);
  }
};
