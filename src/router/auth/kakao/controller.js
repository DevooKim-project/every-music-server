const { default: axios } = require("axios");
const jwt = require("jsonwebtoken");
const qs = require("qs");
const { parseToken } = require("../../../middleware/auth");

const { kakaoService, localService } = require("../../../services/auth");
const { userService } = require("../../../services/database");

exports.login = async (req, res) => {
  try {
    const url = "https://kauth.kakao.com/oauth/authorize";
    const params = {
      client_id: process.env.KAKAO_ID,
      redirect_uri: "http://localhost:5000/auth/kakao/callback",
      response_type: "code",
      // state: "", //CSRF 공격 보호를 위한 임의의 문자열
    };

    return res.redirect(`${url}?${qs.stringify(params)}`);
  } catch (error) {
    console.error(error);
    return res.send(error);
  }
};

exports.getLocalToken = async (req, res) => {
  try {
    const tokens = await kakaoService.getToken(req.query.code);
    console.log(tokens);

    const { access_token, refresh_token } = tokens;
    const profile = await kakaoService.getProfile(access_token);
    console.log(access_token);
    const provider = {
      provider: "kakao",
      providerId: profile.id,
    };
    const exUser = await userService.findOneUser({ email: profile.email });

    if (exUser) {
      if (exUser.provider === provider) {
        console.log("exUser");
        const localToken = localService.createToken(exUser);
        return res.send(localToken);
      } else {
        return res.send(`${exUser.provider.provider}로 가입된 계정 입니다.`);
      }
    }

    const newUser = await userService.createUser({
      email: profile.kakao_account.email,
      nick: profile.kakao_account.profile.nickname,
      provider: {
        provider: "kakao",
        providerId: profile.id,
      },
    });

    const localToken = localService.createToken(newUser);

    return res.send(localToken);
  } catch (error) {
    // console.error(error);
    return res.send(error);
  }
};

exports.logout = async (req, res) => {
  try {
    const url = "https://kauth.kakao.com/oauth/logout";
    const params = {
      client_id: process.env.KAKAO_ID,
      logout_redirect_uri: "http://localhost:5000/",
    };

    return res.redirect(`${url}?${qs.stringify(params)}`);
  } catch (error) {
    console.error(error);
    return res.send(error);
  }
};

exports.signout = async (req, res) => {
  try {
    const localToken = parseToken(req.headers.authorization);
    const payload = jwt.verify(localToken, process.env.JWT_SECRET);
    const params = {
      target_id_type: "user_id",
      target_id: payload.providerId,
    };
    const options = {
      method: "POST",
      url: "https://kapi.kakao.com/v1/user/unlink",
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_ADMIN}`,
      },
      params,
    };

    Promise.all([axios(options), userService.destroyUser(payload.id)]);

    return res.send("signout ok");
  } catch (error) {
    console.error(error);
    return res.send(error);
  }
};
