const express = require("express");

const { verifyToken } = require("../../../middleware/auth");
const {
  getAccessToken,
  searchPlaylist,
  getTrack,
  insertMusic,
  savePlaylist,
} = require("./controller");

const router = express.Router();

router.use(verifyToken, getAccessToken);
router.get("/playlists", searchPlaylist);
router.post("/playlists", insertMusic);
router.post("/playlists/save", savePlaylist);
router.get("/tracks", getTrack);

module.exports = router;
