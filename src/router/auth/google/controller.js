const { googleService, checkScope } = require("../../../services/auth");
const { tokenService } = require("../../../services/database");

exports.withLogin = (req, res, next) => {
  req.OAuth_params = googleService.OAuthParams.withLogin;
  next();
};

exports.withoutLogin = (req, res, next) => {
  req.OAuth_params = googleService.OAuthParams.withOutLogin;
  next();
};

exports.obtainOAuth = async (req, res) => {
  try {
    const endpoint = await googleService.obtainOAuthCredentials(
      req.OAuth_params
    );
    return res.redirect(endpoint);
  } catch (error) {
    return res.send(error);
  }
};

exports.getProviderToken = async (req, res, next) => {
  try {
    const token = await googleService.OAuthRedirect(
      req.query.code,
      req.OAuth_params
    );
    req.provider_token = token;
    next();
  } catch (error) {
    res.send(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    //scope check
    const provider_token = req.provider_token;
    const isValidScope = checkScope(
      provider_token.scope,
      googleService.OAuthParams.withLogin.scopes
    );
    if (!isValidScope) {
      res.send("유요하지 않은 권한");
    }
    const user_id = await googleService.login(req.provider_token);
    req.user_id = user_id;
    next();
  } catch (error) {
    console.error(error);
    res.send({ error });
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
    res.send("saveTokenWithoutLogin google ok");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.signOut = async (req, res) => {
  try {
    const user_id = req.payload.user_id;
    await googleService.signOut(user_id);

    return res.send("signout ok");
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};
