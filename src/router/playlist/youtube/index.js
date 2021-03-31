const express = require("express");

const { verifyToken } = require("../../../middleware/auth");
const {
  getAccessToken,
  searchPlayList,
  getTracks,
  insertMusic,
  savePlayList,
} = require("./controller");

const router = express.Router();

router.use(verifyToken, getAccessToken);
router.get("/playLists", searchPlayList);
router.post("/playLists", insertMusic);
router.post("/playLists/save", savePlayList);
router.get("/tracks", getTracks);

module.exports = router;
