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

router.get("/", withLogin, obtainOAuth);
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
router.get("/signOut", isAccessToken, verifyToken, signOut);

module.exports = router;
