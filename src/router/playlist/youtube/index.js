const express = require("express");

const {
  searchPlayList,
  getPlayListItem,
  getTrackInfo,
  structTrack,
} = require("./controller");

const router = express.Router();

router.get("/playLists", searchPlayList);
router.get("/playListItems", getPlayListItem, getTrackInfo, structTrack);
// router.get("/tracks");
// router.get("/struct");
router.get("/insert");

module.exports = router;
