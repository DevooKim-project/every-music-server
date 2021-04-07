const express = require("express");

const { verifyToken, isAccessToken } = require("../../../middleware/auth");
const {
  getProviderTokenFromDB,
  searchPlaylist,
  getTracks,
  insertMusic,
  storePlaylist,
} = require("./controller");

const router = express.Router();

// router.use(verifyToken, getAccessToken);
router.use(isAccessToken, verifyToken, getProviderTokenFromDB);
router.get("/playlists/search", searchPlaylist);
router.post("/playlists/insert", insertMusic);
router.post("/playlists/store", storePlaylist);
router.get("/tracks", getTracks);

module.exports = router;
