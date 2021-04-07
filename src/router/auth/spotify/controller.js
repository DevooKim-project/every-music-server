const { spotifyService, verifyUser } = require("../../../services/auth");
const { userService, tokenService } = require("../../../services/database");

exports.withLogin = (req, res, next) => {
  const scopes = [
    "user-read-email",
    "playlist-modify-public",
    "playlist-modify-private",
    "playlist-read-private",
  ];
  const redirect_uri = "http://localhost:5000/auth/spotify/callback";
  req.OAuth_params = { scopes, redirect_uri };
  next();
};

exports.withoutLogin = (req, res, next) => {
  const scopes = [
    "playlist-modify-public",
    "playlist-modify-private",
    "playlist-read-private",
  ];
  const redirect_uri = "http://localhost:5000/auth/spotify/callback2";
  req.OAuth_params = { scopes, redirect_uri };
  next();
};

exports.obtainOAuth = async (req, res) => {
  try {
    const endpoint = await spotifyService.obtainOAuthCredentials();
    return res.redirect(endpoint);
  } catch (error) {
    return res.send(error);
  }
};

exports.getProviderToken = async (req, res, next) => {
  try {
    const token = await spotifyService.OAuthRedirect(req.query.code);
    req.provider_token = token;
    next();
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { access_token, refresh_token } = req.provider_token;
    const profile = await spotifyService.getProfile(access_token);
    const user_data = {
      email: profile.email,
      nick: profile.display_name,
      provider: {
        name: "spotify",
        id: profile.id,
      },
    };
    console.log("spotify access_token: ", access_token);
    console.log("spotify refresh_token: ", refresh_token);

    //기존 유저 확인
    const exist_user = await verifyUser({ email: profile.email });
    if (exist_user) {
      //provider 토큰 업데이트
      console.log("exist_user");
      await tokenService.updateToken({
        user: exist_user.id,
        provider: "spotify",
        access_token: access_token,
        refresh_token: refresh_token,
      });
      req.user_id = exist_user._id;
    } else {
      //신규 유저 생성
      console.log("new_user");
      const new_user = await userService.createUser(user_data);
      await tokenService.storeToken({
        user: new_user.id,
        provider: "spotify",
        access_token: access_token,
        refresh_token: refresh_token,
      });
      req.user_id = new_user._id;
    }
    next();
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.saveTokenWithoutLogin = async (req, res) => {
  try {
    const { access_token, refresh_token } = req.provider_token;
    const user_id = req.payload.user_id;
    await tokenService.storeToken({
      user: user_id,
      access_token: access_token,
      refresh_token: refresh_token,
    });
    res.send("saveTokenWithoutLogin spotify ok");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.signOut = async (req, res) => {
  try {
    await spotifyService.signOut(req.payload.user_id);

    return res.send("signout ok");
  } catch (error) {
    console.error(error);
    return res.send(error);
  }
};
