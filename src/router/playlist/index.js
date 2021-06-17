const express = require("express");

const validate = require("../../middleware/validate");
const verifyToken = require("../../middleware/auth");
const controller = require("./controller");
const { playlistValidation } = require("../../validate");
const { tokenTypes } = require("../../config/type");

const router = express.Router();

router.get("/", validate(playlistValidation.getPlaylists), controller.getPlaylists);

router.get("/:playlistId", validate(playlistValidation.getPlaylist), controller.getPlaylist);

router.get(
  "/user/:userId",
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
  "/:playlistId",
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

router.put(
  "/like/:playlistId/:operator",
  validate(playlistValidation.likePlaylist),
  verifyToken(tokenTypes.ACCESS),
  controller.likePlaylist
);

module.exports = router;
