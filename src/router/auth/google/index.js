const express = require("express");

const { verifyToken } = require("../../../middleware/auth");
const { login, getLocalToken, refreshToken } = require("./controller");

const router = express.Router();

router.get("/", login);
router.get("/callback", getLocalToken);
router.get("/refresh:type", verifyToken, refreshToken);

module.exports = router;
