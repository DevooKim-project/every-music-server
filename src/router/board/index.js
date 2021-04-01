const express = require("express");
const playlistRoute = require("./playlist");

const router = express.Router();

router.use("/playlist", playlistRoute);

module.exports = router;
