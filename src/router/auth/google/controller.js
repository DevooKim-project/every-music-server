const jwt = require("jsonwebtoken");

const { googleService, verifyUser } = require("../../../services/auth");
const { userService, tokenService } = require("../../../services/database");

exports.obtainOAuth = async (req, res) => {
  const endpoint = await googleService.obtainOAuthCredentials();
  return res.redirect(endpoint);
};

exports.getProviderToken = async (req, res, next) => {
  try {
    const token = await googleService.OAuthRedirect(req.query.code);
    req.provider_token = token;
    next();
  } catch (error) {
    res.send(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { access_token, refresh_token, id_token } = req.provider_token;
    const profile = jwt.decode(id_token);
    const user_data = {
      email: profile.email,
      nick: profile.name,
      provider: {
        name: "google",
        id: profile.sub,
      },
    };
    console.log("google access_token: ", access_token);
    console.log("google refresh_token: ", refresh_token);

    //기존 유저 확인
    const exist_user = await verifyUser({ email: profile.email });
    if (exist_user) {
      //provider 토큰 업데이트
      console.log("exist_user");
      const token_data = {
        user: exist_user.id,
        provider: "google",
        access_token: access_token,
      };

      //구글의 refresh_token은 최초 1회만 발급
      //특정 조건에서
      if (refresh_token) {
        token_data.refresh_token = refresh_token;
      }
      await tokenService.updateToken(token_data);

      req.user_id = exist_user._id;
    } else {
      //신규 유저 생성
      console.log("new_user");
      const new_user = await userService.createUser(user_data);
      await tokenService.storeToken({
        user: new_user.id,
        provider: "google",
        access_token: access_token,
        refresh_token: refresh_token,
      });
      req.user_id = new_user._id;
    }
    next();
  } catch (error) {
    res.send(error);
  }
};

exports.signOut = async (req, res) => {
  try {
    const user_id = req.payload.id;
    await googleService.signOut(user_id);

    return res.send("signout ok");
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};
