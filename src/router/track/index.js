const express = require("express");

const controller = require("./controller");
const validate = require("../../middleware/validate");
const { playlistValidation } = require("../../validate");

const router = express.Router();

router.get("/:playlistId", validate(playlistValidation.getTrack), controller.getTrack);

module.exports = router;
