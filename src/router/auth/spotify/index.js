const express = require("express");
const { verifyToken } = require("../../../middleware/auth");
const {
  login,
  getServiceToken,
  getLocalToken,
  refreshToken,
  signout,
} = require("./controller");

const router = express.Router();
router.get("/", login);
router.get("/callback", getServiceToken, getLocalToken);
router.get("/refresh/:type", verifyToken, refreshToken);
router.get("/signout");

module.exports = router;
