const jwt = require("jsonwebtoken");
const axios = require("axios");

const {
  createLocalToken,
  refreshLocalToken,
} = require("../../../services/auth/local");
const { parseToken } = require("../../../middleware/auth");
// const { findOneUser, destroyUser } = require("../../../services/database");
const { userService } = require("../../../services/database");

exports.getToken = (req, res) => {
  const localToken = createLocalToken(req.user);
  console.log("jwt: ", localToken);
  // res.redirect("/auth/login");
  res.send(localToken);
};

exports.refreshToken = async (req, res) => {
  try {
    const newToken = await refreshLocalToken(req.headers.Authorization);
    res.send(newToken);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.logout = async (req, res) => {
  const token = parseToken(req);
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const providerId = data.providerId;

  axios
    .get("https://kapi.kakao.com/v1/user/logout", {
      params: {
        target_id: providerId,
        target_id_type: "user_id",
      },
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_ADMIN}`,
      },
    })
    .then()
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      res.send("logout success");
    });
  // res.send(response);

  // try {
  //   await axios({
  //     method: "POST",
  //     headers: {
  //       // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
  //       authorization: `KakaoAK ${process.env.KAKAO_ADMIN}`,
  //     },
  //     url: "https://kapi.kakao.com/v1/user/logout",
  //     data: {
  //       target_id: providerId,
  //       target_id_type: "user_id",
  //     },
  //   });

  // } catch (error) {
  //   // console.log(error);
  //   res.send(error);
  // } finally {
  // res.send('logout ok')
  // }
};

exports.signout = async (req, res) => {
  try {
    const token = parseToken(req);
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const providerId = data.providerId;
    // await destroyUser(providerId);
    await userService.destroyUser(providerId);

    await axios.post(
      "https://kapi.kakao.com/v1/user/unlink",
      {
        target_id: providerId,
        target_id_type: "user_id",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          Authorization: `KakaoAK ${process.env.KAKAO_ADMIN}`,
        },
      }
    );

    res.send("signout ok");
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};
