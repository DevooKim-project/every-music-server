const express = require("express");

const {
  verifyToken,
  isAccessToken,
  isRefreshToken,
  createLocalToken,
} = require("../../../middleware/auth");
const {
  obtainOAuth,
  getProviderToken,
  login,
  signOut,
} = require("./controller");

const router = express.Router();

router.get("/", obtainOAuth);
router.get(
  "/callback",
  getProviderToken,
  login,
  createLocalToken,
  (req, res) => {
    res.send(req.local_access_token);
  }
);

// router.get("/refresh/:type", isRefreshToken, verifyToken);
router.get("/signOut", isAccessToken, verifyToken, signOut);

//로그아웃은 클라이언트에서 jwt제거

module.exports = router;
