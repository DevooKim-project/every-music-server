const express = require("express");
const { login, getLocalToken } = require("./controller");

const router = express.Router();

router.get("/", login);
router.get("/callback", getLocalToken);

module.exports = router;
