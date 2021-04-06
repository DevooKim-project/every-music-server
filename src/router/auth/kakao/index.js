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
  logout,
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
router.get("/logout", logout);
router.get("/signOut", isAccessToken, verifyToken, signOut);

module.exports = router;
