const express = require("express");
const { verifyToken } = require("../../../middleware/auth");
const {
  login,
  getProviderToken,
  getLocalToken,
  updateRefreshToken,
  signout,
} = require("./controller");

const router = express.Router();
router.get("/", login);
router.get("/callback", getProviderToken, getLocalToken);
router.get("/refresh/:type", verifyToken, updateRefreshToken);
router.get("/signout", signout);

module.exports = router;
