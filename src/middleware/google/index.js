const config = require("./config");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");

exports.getUrl = () => {
  const url = config().url;
  return url;
};

exports.getProfile = async (code) => {
  try {
    const oauth2Client = config().oauth2Client;
    const test = await google.options();
    console.log("test: ", test);
    const { tokens } = await oauth2Client.getToken(code);
    await oauth2Client.setCredentials(tokens);

    const exToken = await oauth2Client.getTokenInfo(
      oauth2Client.credentials.access_token
    );

    console.log("exToken: ", exToken);
    //access, refresh => redis에 저장
    console.log("구글 토큰: ", tokens);
    const id_token = jwt.decode(tokens.id_token);
    console.log("id_token: ", id_token);
    const profile = {
      email: id_token.email,
      provider_id: id_token.sub,
      nick: "testNick",
      provider: "google",
    };
    // //access 토큰이 만료되었을때 콜백 실행(?) refresh는 자동 갱신
    oauth2Client.on("tokens", (tokens) => {
      if (tokens.refresh_token) {
        // store the refresh_token in my database!
        console.log("리프레시: ", tokens.refresh_token);
      }
      console.log("액세스: ", tokens.access_token);
    });

    return profile;
  } catch (error) {
    throw new Error(error);
  }
};

exports.test = async () => {
  try {
    const oauth2Client = config().oauth2Client;

    // const exToken = await oauth2Client.getTokenInfo(
    //   oauth2Client.credentials.access_token
    // );

    oauth2Client.refreshAccessToken((err, tokens) => {
      console.log("refresh: ", tokens);
    });

    // console.log("exToken: ", exToken);
  } catch (error) {
    throw new Error(error);
  }
};
