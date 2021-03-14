const axios = require("axios");
const queryString = require("querystring");
const { kakaoService, localService } = require("../../../services/auth");
const { userService, tokenService } = require("../../../services/database");

exports.login = async (req, res) => {
  try {
    const url = "https://kauth.kakao.com/oauth/authorize";
    const params = {
      client_id: process.env.KAKAO_ID,
      redirect_uri: "http://localhost:5000/auth/kakao/callback",
      response_type: "code",
      // state: "", //CSRF 공격 보호를 위한 임의의 문자열
    };

    return res.redirect(`${url}?${queryString.stringify(params)}`);
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

    // console.log(profile);
    const exUser = await userService.findOneUser({
      provider: "kakao",
      providerId: profile.id,
    });

    if (exUser) {
      const localToken = localService.createToken(exUser);
      return res.send(localToken);
    }

    const newUser = await userService.createUser({
      email: profile.kakao_account.email,
      nick: profile.kakao_account.profile.nickname,
      providerId: profile.id,
      provider: "kakao",
    });

    const localToken = localService.createToken(newUser);

    return res.send(localToken);
  } catch (error) {
    // console.error(error);
    return res.send(error);
  }
};
