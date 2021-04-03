const express = require("express");
const {
  getUserId,
  readAllPlaylist,
  readMyPlaylist,
  likePlaylist,
} = require("./controller");

const router = express.Router();

router.get("/read", readAllPlaylist);

//로그인 필요
router.use("/", getUserId);
router.get("/read/my", readMyPlaylist);
router.get("/like/:status", likePlaylist);

module.exports = router;
