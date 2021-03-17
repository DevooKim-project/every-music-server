const express = require("express");

const { searchPlayList, getTracks, getTrackInfo } = require("./controller");

const router = express.Router();

router.get("/playLists", searchPlayList);
router.get("/tracks", getTracks);
router.get("/insert");

router.get("/test", getTrackInfo);

module.exports = router;
