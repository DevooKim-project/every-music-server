const express = require("express");
const auth = require("../../middleware/auth");
const controller = require("./controller");

const router = express.Router();

router.get("/", controller.readAllPlaylist);
router.get("/library", auth.isAccessToken, controller.readLibrary);
router.put("/like", auth.isAccessToken, controller.likePlaylist);
router.put("/update", auth.isAccessToken, controller.changePrivatePlaylist);
router.delete("/", auth.isAccessToken, controller.deletePlaylist);
module.exports = router;
