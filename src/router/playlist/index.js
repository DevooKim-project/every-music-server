const express = require("express");
const auth = require("../../middleware/auth");
const controller = require("./controller");

const router = express.Router();

router.get("/", controller.readAllPlaylist);
router.get("/:user_id", auth.hasToken, controller.readUserPlaylist);
router.get("/library/:user_id", auth.isAccessToken, controller.readLibrary);
router.put(
  "/like/:user_id/:operator",
  auth.isAccessToken,
  controller.likePlaylist
);
router.put(
  "/update/:playlist_id",
  auth.isAccessToken,
  controller.updatePlaylistOptions
);
router.delete("/:playlist_id", auth.isAccessToken, controller.deletePlaylist);
module.exports = router;
