const express = require("express");

const { verifyToken, isAccessToken } = require("../../../middleware/auth");
const {
  getProviderTokenFromDB,
  searchPlaylist,
  getTrack,
  insertMusic,
  storePlaylist,
} = require("./controller");

const router = express.Router();

router.use(isAccessToken, verifyToken, getProviderTokenFromDB);
router.get("/playlists", searchPlaylist);
router.post("/playlists", insertMusic);
router.post("/playlists/save", storePlaylist);
router.get("/tracks", getTrack);

module.exports = router;
