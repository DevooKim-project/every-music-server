const axios = require("axios");
const qs = require("qs");

const { base64Encode } = require("../../middleware/auth");

const getToken = async (code) => {
  try {
    const data = {
      code,
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:5000/auth/spotify/callback",
    };

    const key = base64Encode(
      `${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_SECRET}`
    );

    const test = Buffer.from(
      `${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_SECRET}`
    ).toString("base64");

    console.log(key === test);
    console.log(key);
    console.log(test);

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

const getProfile = async (token) => {
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
    throw new Error("getProfile Error: ", error);
  }
};

module.exports = { getToken, getProfile };
