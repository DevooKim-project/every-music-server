const express = require("express");

const auth = require("../../../middleware/auth");
const controller = require("./controller");

const router = express.Router();

// router.use(verifyToken, getAccessToken);
router.use(auth.isAccessToken, controller.getProviderTokenFromDB);
router.get("/playlists", controller.searchPlaylist);
router.post("/playlists", controller.insertMusic);
router.post("/playlists/upload", controller.uploadPlaylist);
router.get("/tracks", controller.getTracks);

module.exports = router;
