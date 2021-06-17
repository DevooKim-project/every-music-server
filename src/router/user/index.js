const express = require("express");

const { tokenTypes } = require("../../config/type");
const verifyToken = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const { userValidation } = require("../../validate");
const controller = require("./controller");

const router = express.Router();

router.get("/library", verifyToken(tokenTypes.ACCESS), controller.getLibrary);

router.get("/library/:playlistId", verifyToken(tokenTypes.ACCESS), controller.getLibrary);

router.get("/:userId", validate(userValidation.getUserById), controller.getUserById);

module.exports = router;
