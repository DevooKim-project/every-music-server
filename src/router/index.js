const express = require("express");

const authRoute = require("./auth");
const playListRoute = require("./playlist");
const test = require("./test");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("home");
});

router.use("/auth", authRoute);
router.use("/playList", playListRoute);

router.get("/test", async (req, res) => {
  try {
    const response = await test();
    res.send(response);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

router.use((req, res) => {
  res.status(404).send("Bad request");
});

module.exports = router;
