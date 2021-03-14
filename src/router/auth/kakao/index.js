const express = require("express");
const { login, getLocalToken, logout } = require("./controller");

const router = express.Router();

router.get("/", login);
router.get("/callback", getLocalToken);
router.get("/logout", logout);

module.exports = router;
