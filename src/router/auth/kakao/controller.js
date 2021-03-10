const jwt = require("jsonwebtoken");
const axios = require("axios");

const createToken = require("../../../services/auth");
const { parseToken } = require("../../../middleware/auth");
const { findOneUser } = require("../../../services/user");

exports.getToken = (req, res) => {
  const token = createToken(req.user);
  console.log("jwt: ", token);
  // res.redirect("/auth/login");
  res.send(token);
};

exports.refreshToken = async (req, res) => {
  try {
    const exToken = parseToken(req);
    const data = jwt.verify(exToken, process.env.JWT_SECRET);
    const user = await findOneUser({ id: data.id });
    const newToken = createToken(user);
    res.json(newToken);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.logout = (req, res) => {
  try {
    const token = parseToken(req);
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const providerId = data.providerId;

    axios.get("https://kapi.kakao.com/v1/user/logout", {
      params: {
        target_id: providerId,
        target_id_type: "user_id",
      },
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_ADMIN}`,
      },
    });
    // res.send(response);
  } catch (error) {
    console.error(error);
    // res.send(error);
  } finally {
    res.send("logout success");
  }
};
