const express = require("express");

const controller = require("./controller");
const verifyToken = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const { tokenTypes } = require("../../config/type");
const { convertValidation } = require("../../validate");

const router = express.Router();

router.use(
  "/:platform",
  validate(convertValidation.convertPlatform),
  verifyToken(tokenTypes.ACCESS),
  controller.getPlatformTokenByUserId
);

//get playlists from platform
router.get("/:platform/playlists", controller.getPlaylistFromPlatform);

//playlists insert into platform
router.post("/:platform/playlists", validate(convertValidation.convertPlatform), controller.convertPlaylist);

//get tracks from platform playlists
router.post("/:platform/tracks", validate(convertValidation.getTrack), controller.getItemFromPlatform);

module.exports = router;
