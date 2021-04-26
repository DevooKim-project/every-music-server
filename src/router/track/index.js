const express = require("express");

const controller = require("./controller");
const validate = require("../../middleware/validate");
const { playlistValidation } = require("../../validate");

const router = express.Router();

router.get("/:playlistId", validate(playlistValidation.readTrack), controller.readTrack);

module.exports = router;
