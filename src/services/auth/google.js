const axios = require("axios");
const qs = require("qs");
const jwt = require("jsonwebtoken");

// const { tokenService, userService } = require("../database");
const { tokenService } = require("../../services");
const { platformTypes } = require("../../config/type");
const { Token } = require("../../database/schema");

exports.OAuthParams = {
  withLogin: {
    scopes: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube.force-ssl",
      "https://www.googleapis.com/auth/youtube",
    ],
    redirect_uri: `http://localhost:5000/auth/google/callback`,
  },

  withOutLogin: {
    scopes: [
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube.force-ssl",
      "https://www.googleapis.com/auth/youtube",
    ],
    redirect_uri: `http://localhost:5000/auth/google/callbackToken`,
  },
};

exports.obtainOAuthCredentials = async (OAuth_params) => {
  const url = "https://accounts.google.com/o/oauth2/v2/auth";

  const { scopes, redirect_uri } = OAuth_params;

  const params = {
    clientid: process.env.GOOGLEid,
    redirect_uri: redirect_uri,
    response_type: "code",
    access_type: "offline",
    scope: scopes.join(" "),
  };

  const endpoint = await `${url}?${qs.stringify(params)}`;
  return endpoint;
};

exports.OAuthRedirect = async (code, OAuth_params) => {
  try {
    const { redirect_uri } = OAuth_params;

    const data = {
      code,
      clientid: process.env.GOOGLEid,
      client_secret: process.env.GOOGLE_SECRET,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    };

    const response = await axios({
      method: "POST",
      url: "https://oauth2.googleapis.com/token",
      data: qs.stringify(data),
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

exports.login = async (token) => {
  try {
    const { access_token, refresh_token, id_token } = token;
    const profile = jwt.decode(id_token);

    //기존 유저 확인
    const exist_user = await userService.findOneUser({ email: profile.email });
    if (exist_user.provider !== "spotify") {
      // res.status(400).send(`이미 ${exist_user.provider}로 가입된 유저입니다.`);
      throw new Error(`이미 ${exist_user.provider}로 가입된 유저입니다.`);
    }
    if (exist_user) {
      //provider 토큰 업데이트
      console.log("exist_user");
      const token_data = {
        user: exist_user.id,
        provider: "google",
        access_token: access_token,
      };

      //구글의 refresh_token은 최초 1회만 발급
      //특정 조건에서만 알아서 재발급됨
      if (refresh_token) {
        token_data.refresh_token = refresh_token;
      }
      await tokenService.updateToken(token_data);
      return exist_user.id;
    } else {
      //신규 유저 생성
      console.log("new_user");
      const new_user = await userService.createUser({
        email: profile.email,
        nick: profile.name,
        provider: {
          name: "google",
          id: profile.sub,
        },
      });
      await tokenService.storeToken({
        user: new_user.id,
        provider: "google",
        access_token: access_token,
        refresh_token: refresh_token,
      });
      return new_user.id;
    }
  } catch (error) {
    throw error;
  }
};

//에러처리: 리프레시 토큰이 만료된 경우
//google은 만료 안됨
exports.updateRefreshToken = async (userid) => {
  try {
    const token = await tokenService.findToken({
      user: userid,
      provider: "google",
    });
    if (!token) {
      throw { code: 404, message: "Not Found Token" };
    }

    const data = {
      clientid: process.env.GOOGLEid,
      client_secret: process.env.GOOGLE_SECRET,
      refresh_token: token.refresh_token,
      grant_type: "refresh_token",
    };

    const response = await axios({
      method: "POST",
      url: "https://oauth2.googleapis.com/token",
      data: qs.stringify(data),
    });

    return response.data.access_token;
    await tokenService.updateToken({
      user: userid,
      provider: "google",
      access_token: response.data.access_token,
    });
    console.log("google new_access_token: ", response.data.access_token);
    return;
  } catch (error) {
    throw error;
  }
};

exports.signOut = async (userId) => {
  try {
    const token = await tokenService.findPlatformTokenById(
      userId,
      platformTypes.GOOGLE
    );
    console.log("token: ", token);
    const params = {
      token: token.refreshToken,
    };
    const options = {
      method: "POST",
      url: "https://oauth2.googleapis.com/revoke",
      params,
    };

    Promise.all([
      axios(options),
      Token.deleteMany({ user: userId }),
      userService.deleteUserById(userId),
    ]);
  } catch (error) {
    throw error;
  }
};
