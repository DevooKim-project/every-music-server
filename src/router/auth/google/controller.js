const axios = require("axios");
const jwt = require("jsonwebtoken");
const queryString = require("querystring");

const { createToken } = require("../../../services/auth/local");

exports.login = async (req, res) => {
  const url = "https://accounts.google.com/o/oauth2/v2/auth";
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
  ];

  const params = {
    client_id: process.env.GOOGLE_ID,
    redirect_uri: "http://localhost:5000/auth/google/callback",
    response_type: "code",
    access_type: "offline",
    scope: scopes.join(" "),
  };

  res.redirect(`${url}?${queryString.stringify(params)}`);
};

exports.getToken = async (req, res, next) => {
  try {
    const code = req.query.code;
    //if (code)

    const data = {
      code,
      client_id: process.env.GOOGLE_ID,
      client_secret: process.env.GOOGLE_SECRET,
      redirect_uri: "http://localhost:5000/auth/google/callback",
      grant_type: "authorization_code",
    };

    const response = await axios({
      method: "POST",
      // url: "https://accounts.gogle.com/o/oauth2/token",
      url: "https://oauth2.googleapis.com/token",
      data,
    });
    console.log(response.data);

    const { access_token, refresh_token, id_token } = response.data;
    const profile = jwt.decode(id_token);

    //0. id_token 파싱
    //1. 유저생성
    //2. 유저객체 리턴
    //3. createToken(유저객체)
    //4.
    // const user = {
    //   id:
    // }
    const token = createToken(user);

    res.send(id);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

/*

구글 access 토큰 재발급

POST /token HTTP/1.1

Host: oauth2.googleapis.com

Content-Type: application/x-www-form-urlencoded

client_id=your_client_id&

client_secret=your_client_secret&

refresh_token=refresh_token&

grant_type=refresh_token

*/
