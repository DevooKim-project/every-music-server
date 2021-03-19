const express = require("express");

const { verifyToken } = require("../../../middleware/auth");
const {
  getAccessToken,
  searchPlayList,
  getTracks,
  insertMusic,
} = require("./controller");

const router = express.Router();

router.use(verifyToken, getAccessToken);
router.get("/playLists", searchPlayList);
router.post("/playLists", insertMusic);
router.get("/tracks", getTracks);

module.exports = router;
