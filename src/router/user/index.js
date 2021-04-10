const express = require("express");

const auth = require("../../middleware/auth");
const controller = require("./controller");

const router = express.Router();

router.get("/:user_id", auth.hasToken, controller.readUserPlaylist);
router.get("/library/:user_id", auth.isAccessToken, controller.readLibrary);

module.exports = router;
