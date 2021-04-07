const express = require("express");

const youtubeRoute = require("./youtube");
const spotifyRoute = require("./spotify");

const router = express.Router();

router.use("/youtube", youtubeRoute);
router.use("/spotify", spotifyRoute);

module.exports = router;
