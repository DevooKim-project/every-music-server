const { spotifyService } = require("../../../services/auth");
const { tokenService } = require("../../../services/database");

exports.withLogin = (req, res, next) => {
  req.OAuth_params = spotifyService.OAuthParams.withLogin;
  next();
};

exports.withoutLogin = (req, res, next) => {
  req.OAuth_params = spotifyService.OAuthParams.withOutLogin;
  next();
};

exports.obtainOAuth = async (req, res) => {
  try {
    const endpoint = await spotifyService.obtainOAuthCredentials(
      req.OAuth_params
    );
    return res.redirect(endpoint);
  } catch (error) {
    return res.send(error);
  }
};

exports.getProviderToken = async (req, res, next) => {
  try {
    const token = await spotifyService.OAuthRedirect(
      req.query.code,
      req.OAuth_params
    );
    req.provider_token = token;
    next();
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user_id = await spotifyService.login(req.provider_token);
    req.user_id = user_id;
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
