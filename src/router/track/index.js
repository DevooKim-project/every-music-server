const express = require("express");

const controller = require("./controller");

const router = express.Router();

router.get("/:playlistid", controller.readTrackOfPlaylist);

module.exports = router;
