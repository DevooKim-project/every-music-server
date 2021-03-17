const express = require("express");

const { searchList, getItems } = require("./controller");

const router = express.Router();

router.get("/searchList", searchList);
router.get("/getItems", getItems);
router.get("/getTrack");
router.get("/struct");
router.get("/insert");

module.exports = router;
