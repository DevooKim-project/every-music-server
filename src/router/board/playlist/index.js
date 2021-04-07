const express = require("express");
const { verifyToken } = require("../../../middleware/auth");
const {
  getUserId,
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
router.get("/read/:playlistId");
router.get("/read/:user_id", (req, res, next) => {
  if (req.headers.authorization) {
    verifyToken(req, res, next);
  }
  readUserPlaylist(req, res);
});
router.get("/like/:status", likePlaylist);

module.exports = router;
