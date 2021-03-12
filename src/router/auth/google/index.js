const express = require("express");
const { login, getToken } = require("./controller");

const router = express.Router();

router.get("/", login);

router.get("/callback", getToken);

module.exports = router;
