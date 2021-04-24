const express = require("express");

const { tokenTypes } = require("../../config/type");
const verifyToken = require("../../middleware/auth");
const controller = require("./controller");

const router = express.Router();

router.get("/library", verifyToken(tokenTypes.ACCESS), controller.getLibrary);

module.exports = router;
