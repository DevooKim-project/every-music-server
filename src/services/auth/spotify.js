const axios = require("axios");
const qs = require("qs");
const { Base64 } = require("js-base64");

const { userService, tokenService } = require("../database");

exports.OAuthParams = {
  withLogin: {
    scopes: [
      "user-read-email",
      "playlist-modify-public",
      "playlist-modify-private",
      "playlist-read-private",
    ],
    redirect_uri: "http://localhost:5000/auth/spotify/callback",
  },
  withoutLogin: {
    scopes: [
      "playlist-modify-public",
      "playlist-modify-private",
      "playlist-read-private",
    ],
    redirect_uri: "http://localhost:5000/auth/spotify/callbackToken",
  },
};

exports.obtainOAuthCredentials = async (OAuth_params) => {
  const url = "https://accounts.spotify.com/authorize";
  const { scopes, redirect_uri } = OAuth_params;

  const params = {
    response_type: "code",
    client_id: process.env.SPOTIFY_ID,
    redirect_uri: redirect_uri,
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
      grant_type: "authorization_code",
      redirect_uri: redirect_uri,
    };

    const key = Base64.encode(
      `${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_SECRET}`
    );

    const response = await axios({
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        authorization: `Basic ${key}`,
      },
      data: qs.stringify(data),
    });

    console.log("response: ", response.data);

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

exports.login = async (token) => {
  try {
    const { access_token, refresh_token } = token;
    const profile = await this.getProfile(access_token);
    console.log("spotify access_token: ", access_token);
    console.log("spotify refresh_token: ", refresh_token);

    //기존 유저 확인
    const exist_user = await userService.findOneUser({ email: profile.email });
    if (exist_user) {
      //provider 토큰 업데이트
      console.log("exist_user");
      await tokenService.updateToken({
        user: exist_user.id,
        provider: "spotify",
        access_token: access_token,
        refresh_token: refresh_token,
      });
      return exist_user._id;
    } else {
      //신규 유저 생성
      console.log("new_user");
      const new_user = await userService.createUser({
        email: profile.email,
        nick: profile.display_name,
        provider: {
          name: "spotify",
          id: profile.id,
        },
      });
      await tokenService.storeToken({
        user: new_user.id,
        provider: "spotify",
        access_token: access_token,
        refresh_token: refresh_token,
      });
      return new_user._id;
    }
  } catch (error) {
    throw error;
  }
};
exports.getProfile = async (token) => {
  try {
    const response = await axios({
      method: "GET",
      url: "https://api.spotify.com/v1/me",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    // console.error(error);
    throw error;
  }
};

//에러처리: 리프레시 토큰이 만료된 경우
//
exports.updateRefreshToken = async (user_id) => {
  try {
    const token = await tokenService.findToken({
      user: user_id,
      provider: "spotify",
    });
    console.log("find refresh: ", token.refresh_token);

    const data = {
      grant_type: "refresh_token",
      refresh_token: token.refresh_token,
    };

    const key = Base64.encode(
      `${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_SECRET}`
    );

    const response = await axios({
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        authorization: `Basic ${key}`,
      },
      data: qs.stringify(data),
    });

    await tokenService.updateToken({
      user: user_id,
      provider: "spotify",
      access_token: response.data.access_token,
      // refresh_token: response.data.refresh_token,
    });

    console.log(response.data);
    console.log("spotify new_access_token: ", response.data.access_token);
    // console.log("spotify new_refresh_token: ", response.data.refresh_token);

    return;
  } catch (error) {
    throw error;
  }
};

exports.signOut = async (user_id) => {
  try {
    Promise.all([
      tokenService.deleteToken(user_id),
      userService.destroyUser(user_id),
    ]);
    return;
  } catch (error) {
    throw error;
  }
};
