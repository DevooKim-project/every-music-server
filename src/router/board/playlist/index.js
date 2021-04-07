const express = require("express");
const { verifyToken, isAccessToken } = require("../../../middleware/auth");
const {
  readAllPlaylist,
  readUserPlaylist,
  likePlaylist,
} = require("./controller");

const router = express.Router();

router.use((req, res, next) => {
  if (req.headers.authorization) {
  }
});
router.get("/read", readAllPlaylist);
router.get("/read/playlist/:playlistId");
router.get("/read/");
router.get("/read/:user_id/:max_result/:last_id", (req, res, next) => {
  if (req.headers.authorization) {
    isAccessToken(req, res, next);
    // verifyToken(req, res, next);
  }
  readUserPlaylist(req, res);
});
router.get("/like/:status", likePlaylist);

module.exports = router;
