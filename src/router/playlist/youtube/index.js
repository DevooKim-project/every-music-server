const express = require("express");

const { verifyToken } = require("../../../middleware/auth");
const { getAccessToken, searchPlayList, getTracks } = require("./controller");

const router = express.Router();

router.use(verifyToken, getAccessToken);
router.get("/playLists", searchPlayList);
router.get("/tracks", getTracks);

module.exports = router;
