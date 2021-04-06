const express = require("express");

const {
  verifyToken,
  isAccessToken,
  isRefreshToken,
  createLocalToken,
} = require("../../../middleware/auth");
const {
  withLogin,
  withoutLogin,
  obtainOAuth,
  getProviderToken,
  login,
  saveTokenWithoutLogin,
  signOut,
} = require("./controller");

const router = express.Router();

router.get("/", withLogin, obtainOAuth); //배포시 post
router.get(
  "/callback",
  withLogin,
  getProviderToken,
  login,
  createLocalToken,
  (req, res) => {
    res.send(req.local_access_token);
  }
);

router.get("/token", withoutLogin, obtainOAuth);
router.get(
  "/callback2",
  isAccessToken,
  verifyToken,
  withoutLogin,
  saveTokenWithoutLogin
);

// router.get("/refresh/:type", isRefreshToken, verifyToken);
router.get("/signOut", isAccessToken, verifyToken, signOut);

//로그아웃은 클라이언트에서 jwt제거

module.exports = router;
