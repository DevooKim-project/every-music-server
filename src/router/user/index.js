const express = require("express");

const auth = require("../../middleware/auth");
const controller = require("./controller");

const router = express.Router();

router.get("/:userid", auth.hasToken, controller.readUserPlaylist);
router.get("/library/:userid", auth.isAccessToken, controller.readLibrary);

module.exports = router;
