const express = require("express");
const auth = require("../../middleware/auth");
const controller = require("./controller");

const router = express.Router();

router.get("/", controller.readAllPlaylist);
router.post("/upload", controller.uploadPlaylist);

router.put(
  "/like/:userid/:operator",
  auth.isAccessToken,
  controller.likePlaylist
);
router.put(
  "/update/:playlistid",
  auth.isAccessToken,
  controller.updatePlaylistOptions
);
router.delete("/:playlistid", auth.isAccessToken, controller.deletePlaylist);
module.exports = router;
