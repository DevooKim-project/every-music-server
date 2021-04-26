const axios = require("axios");
const qs = require("qs");
const { userService } = require("../database");

exports.OAuthParams = {
  scopes: ["account_email", "profile"],
  redirect_uri: `http://localhost:5000/auth/kakao/callback`,
};

exports.obtainOAuthCredentials = async (OAuth_params, type = "") => {
  const { scopes, redirect_uri } = OAuth_params;
  const url = "https://kauth.kakao.com/oauth/authorize";
  const params = {
    clientid: process.env.KAKAOid,
    redirect_uri: redirect_uri,
    response_type: "code",
    // state: "", //CSRF 공격 보호를 위한 임의의 문자열
  };

  if ((type = "additional")) {
    params.scope = scopes.join(",");
  }

  const endpoint = await `${url}?${qs.stringify(params)}`;
  return endpoint;
};

exports.OAuthRedirect = async (code) => {
  try {
    const data = {
      code,
      clientid: process.env.KAKAOid,
      client_secret: process.env.KAKAO_SECRET,
      redirect_uri: "http://localhost:5000/auth/kakao/callback",
      grant_type: "authorization_code",
    };

    const response = await axios({
      method: "POST",
      url: "https://kauth.kakao.com/oauth/token",
      data: qs.stringify(data),
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

exports.obtainAdditionalPermissions = async (scope, redirect_uri) => {
  const url = "https://kauth.kakao.com/oauth/authorize";
  const params = {
    clientid: process.env.KAKAOid,
    redirect_uri: "http://localhost:5000/auth/kakao/callback",
    response_type: "code",
    scope: scope.join(","),
    // state: "", //CSRF 공격 보호를 위한 임의의 문자열
  };

  const endpoint = await `${url}?${qs.stringify(params)}`;
  return endpoint;
};

exports.login = async (token) => {
  try {
    const { access_token, refresh_token } = token;
    const profile = await this.getProfile(access_token);
    const account = profile.kakao_account;

    console.log("kakao access_token: ", access_token);
    console.log("kakao refresh_token: ", refresh_token);

    const exist_user = await userService.findOneUser({ email: account.email });

    if (exist_user) {
      console.log("exist_user");
      return exist_user.id;
    } else {
      console.log("new_user");
      const new_user = await userService.createUser({
        email: account.email,
        nick: account.profile.nickname,
        provider: {
          name: "kakao",
          id: profile.id,
        },
      });
      return new_user.id;
    }
  } catch (error) {
    throw error;
  }
};

exports.getProfile = async (token) => {
  try {
    const profile = await axios({
      method: "POST",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    return profile.data;
  } catch (error) {
    throw new Error(error);
  }
};

exports.logout = async () => {
  try {
    const url = "https://kauth.kakao.com/oauth/logout";
    const params = {
      clientid: process.env.KAKAOid,
      logout_redirect_uri: "http://localhost:5000/",
    };

    const endpoint = await `${url}?${qs.stringify(params)}`;
    return endpoint;
  } catch (error) {
    throw error;
  }
};

exports.signOut = async (userid, providerid) => {
  try {
    const params = {
      targetid_type: "userid",
      targetid: providerid,
    };
    const options = {
      method: "POST",
      url: "https://kapi.kakao.com/v1/user/unlink",
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_ADMIN}`,
      },
      params,
    };

    Promise.all([axios(options), userService.destroyUser(userid)]);
    return;
  } catch (error) {
    throw error;
  }
};
