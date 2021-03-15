const qs = require("qs");

const { spotifyService, localService } = require("../../../services/auth");
const { userService, tokenService } = require("../../../services/database");

exports.login = async (req, res) => {
  const url = "https://accounts.spotify.com/authorize";
  const scopes = [
    "user-read-email",
    "playlist-modify-public",
    "playlist-modify-private",
    "playlist-read-private",
    "playlist-read-collaborative",
  ];

  const params = {
    response_type: "code",
    client_id: process.env.SPOTIFY_ID,
    redirect_uri: "http://localhost:5000/auth/spotify/callback",
    scope: scopes.join(" "),
  };

  return res.redirect(`${url}?${qs.stringify(params)}`);
};

exports.getServiceToken = async (req, res, next) => {
  try {
    const tokens = await spotifyService.getToken(req.query.code);
    req.tokens = tokens;
    next();
  } catch (error) {
    console.error(error);
    res.send(error); //확인 필요
  }
};

exports.getLocalToken = async (req, res) => {
  try {
    const { access_token, refresh_token } = req.tokens;
    console.log("refresh_token: ", refresh_token);
    const profile = await spotifyService.getProfile(access_token);

    const exUser = await userService.findOneUser({
      provider: "spotify",
      providerId: profile.id,
    });

    if (exUser) {
      const localToken = localService.createToken(exUser);
      await tokenService.updateToken(
        {
          userId: exUser.id,
          accessToken: access_token,
          refresh_token: refresh_token,
        },
        "spotify"
      );
      return res.send(localToken);
    }

    const newUser = await userService.createUser({
      email: profile.email,
      nick: profile.display_name,
      providerId: profile.id,
      provider: "spotify",
    });

    const localToken = localService.createToken(newUser);

    await tokenService.storeToken(
      {
        userId: newUser.id,
        accessToken: access_token,
        refreshToken: refresh_token,
      },
      "spotify"
    );

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
        await spotifyService.refreshToken(req.headers.authorization);
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

    //사용자가 스포티파이에서 직접 토큰 제거해야함 따라서 db에서만 제거

    await tokenService.deleteToken(userId);
    await userService.destroyUser({ id: userId });

    return res.send("signout ok");
  } catch (error) {
    console.error(error);
    return res.send(error);
  }
};
