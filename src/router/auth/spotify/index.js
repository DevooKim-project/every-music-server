const express = require("express");
const { login, getServiceToken, getLocalToken } = require("./controller");

const router = express.Router();
router.get("/", login);
router.get("/callback", getServiceToken, getLocalToken);

module.exports = router;
