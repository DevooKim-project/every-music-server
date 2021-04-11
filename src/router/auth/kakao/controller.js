const { kakaoService, checkScope } = require("../../../services/auth");

exports.obtainOAuth = async (req, res) => {
  try {
    const endpoint = await kakaoService.obtainOAuthCredentials();
    return res.redirect(endpoint);
  } catch (error) {
    return res.send(error);
  }
};
exports.getProviderToken = async (req, res, next) => {
  try {
    const token = await kakaoService.OAuthRedirect(req.query.code);
    console.log(token);
    req.provider_token = token;
    next();
  } catch (error) {
    res.send(error);
  }
};

//에러처리: 이메일이 없는 경우 이메일 요청 => kakao_account.has_email
exports.login = async (req, res, next) => {
  try {
    const provider_token = req.provider_token;
    const necessary_scope = ["account_email", "profile"];
    const isValidScope = checkScope(provider_token.scope, necessary_scope);

    if (!isValidScope) {
      res.send("유요하지 않은 권한");
    }
    const user_id = await kakaoService.login(req.provider_token);
    req.user_id = user_id;
    next();
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

exports.logout = async (req, res) => {
  try {
    const endpoint = await kakaoService.logout();
    return res.redirect(endpoint);
  } catch (error) {
    return res.send(error);
  }
};

exports.signOut = async (req, res) => {
  try {
    const provider_id = req.payload.provider_id;
    await kakaoService.signOut(provider_id);

    return res.send("signout ok");
  } catch (error) {
    console.error(error);
    return res.send(error);
  }
};
