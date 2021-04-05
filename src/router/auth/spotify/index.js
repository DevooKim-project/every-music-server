const express = require("express");
const { verifyToken } = require("../../../middleware/auth");
const {
  oAuth,
  getProviderToken,
  getLocalToken,
  updateRefreshToken,
  signout,
} = require("./controller");

const router = express.Router();
router.get("/", oAuth);
router.get("/callback", getProviderToken, getLocalToken);
router.get("/refresh/:type", verifyToken, updateRefreshToken);
router.get("/signout", signout);

module.exports = router;
