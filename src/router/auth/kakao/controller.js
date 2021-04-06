const { kakaoService, verifyUser } = require("../../../services/auth");
const { userService } = require("../../../services/database");

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
    req.provider_token = token;
    next();
  } catch (error) {
    res.send(error);
  }
};

//에러처리: 이메일이 없는 경우 이메일 요청 => kakao_account.has_email
exports.login = async (req, res, next) => {
  try {
    const { access_token, refresh_token } = req.provider_token;
    const profile = await kakaoService.getProfile(access_token);
    const account = profile.kakao_account;
    const user_data = {
      email: account.email,
      nick: account.profile.name,
      provider: {
        name: "kakao",
        id: profile.id,
      },
    };
    console.log("kakao access_token: ", access_token);
    console.log("kakao refresh_token: ", refresh_token);

    const exist_user = await verifyUser({ email: account.email });

    if (exist_user) {
      console.log("exist_user");
      req.user_id = exist_user._id;
    } else {
      console.log("new_user");
      const new_user = await userService.createUser(user_data);
      req.user_id = new_user._id;
    }
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
