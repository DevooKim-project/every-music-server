const express = require("express");
const validate = require("../../middleware/validate");
const verifyToken = require("../../middleware/auth");
const { playlistValidation } = require("../../validate");
const controller = require("./controller");
const { tokenTypes } = require("../../config/type");

const router = express.Router();

router.get("/", validate(playlistValidation.getPlaylists), controller.getPlaylists);
router.get(
  "/:userId",
  validate(playlistValidation.getPlaylistsByUser),
  verifyToken(tokenTypes.ACCESS, false),
  controller.getPlaylistsByUser
);

router.post(
  "/upload",
  validate(playlistValidation.uploadPlaylist),
  verifyToken(tokenTypes.ACCESS),
  controller.uploadPlaylist
);

router.put(
  "/like/:userId/:operator",
  validate(playlistValidation.likePlaylist),
  verifyToken(tokenTypes.ACCESS),
  controller.likePlaylist
);

router.put(
  "/update/:playlistId",
  validate(playlistValidation.updatePlaylist),
  verifyToken(tokenTypes.ACCESS),
  controller.updatePlaylistOptions
);

router.delete(
  "/:playlistId",
  validate(playlistValidation.deletePlaylist),
  verifyToken(tokenTypes.ACCESS),
  controller.deletePlaylist
);

module.exports = router;
