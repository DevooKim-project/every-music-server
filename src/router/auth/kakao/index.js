const express = require("express");
const { login, getLocalToken, logout, signout } = require("./controller");

const router = express.Router();

router.get("/", login);
router.get("/callback", getLocalToken);
router.get("/logout", logout);
router.get("/signout", signout);

module.exports = router;
