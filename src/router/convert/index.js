const express = require("express");

const controller = require("./controller");
const verifyToken = require("../../middleware/auth");
const { tokenTypes, platformTypes } = require("../../config/type");
const convertPlatform = require("../../validate/ConvertValidation");
const router = express.Router();

router.use(verifyToken(tokenTypes.ACCESS), controller.getPlatformTokenByUserId);

//get playlists from platform
router.get("/:platform/playlists", controller.getPlaylistsFromPlatform);

//playlists insert into platform
router.post("/:platform/playlists", controller.uploadPlaylistsToLocal);

//get tracks from platform playlists
router.get("/:platform/tracks", controller.getTracksFromPlatform);

module.exports = router;
