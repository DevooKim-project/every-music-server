const axios = require("axios");
const queryString = require("querystring");
const { kakaoService } = require("../../../services/auth");

exports.login = async (req, res) => {
  try {
    const url = "https://kauth.kakao.com/oauth/authorize";
    const params = {
      client_id: process.env.KAKAO_ID,
      redirect_uri: "http://localhost:5000/auth/kakao/callback",
      response_type: "code",
      // state: "", //CSRF 공격 보호를 위한 임의의 문자열
    };

    // const response = await axios({
    //   method: "GET",
    //   baseURL: "https://kauth.kakao.com",
    //   url: "/oauth/authorize",
    //   params,
    // });

    // return res.redirect("/auth/kakao/callback");
    // return res.send(response.data);

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

    return res.send(tokens);
  } catch (error) {
    console.error(error);
    return res.send(error);
  }
};
