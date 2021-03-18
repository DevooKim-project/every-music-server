const express = require("express");
const { verifyToken } = require("../../../middleware/auth");

const { getAccessToken, searchPlayList, getTrack } = require("./controller");
const router = express.Router();

router.use(verifyToken, getAccessToken);
router.get("/playLists", searchPlayList);
router.get("/tracks", getTrack);

module.exports = router;
