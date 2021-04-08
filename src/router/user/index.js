const express = require("express");

const auth = require("../../middleware/auth");
const controller = require("./controller");

const router = express.Router();

router.get("/:user_id", (req, res) => {
  //내가 올린 리스트검색
  if (req.headers.authorization) {
    auth.isAccessToken(req, res, next);
  }

  controller.readUserPlaylist(req, res);
});

module.exports = router;
