const express = require("express");
const { verifyToken } = require("../../../middleware/auth");
const {
  login,
  getServiceToken,
  getLocalToken,
  refreshToken,
} = require("./controller");

const router = express.Router();
router.get("/", login);
router.get("/callback", getServiceToken, getLocalToken);
router.get("/refresh/:type", verifyToken, refreshToken);

module.exports = router;
