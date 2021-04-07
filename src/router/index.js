const express = require("express");

const authRoute = require("./auth");
const convertRoute = require("./convert");
const playlistRoute = require("./playlist");
const userRoute = require("./user");
const trackRoute = require("./track");

const router = express.Router();

const Test = require("../database/schema/test");

router.get("/", async (req, res) => {
  await Test.create({ num: 1 });
  await Test.create({ num: 2 });
  await Test.create({ num: 3 });
  await Test.create({ num: 4 });

  const b = [1, 2, 3, 4];

  const f = await Test.find({ num: { $in: b } });
  console.log(f);
  res.send("dd");
});

router.use("/auth", authRoute);
router.use("/convert", convertRoute);
router.use("/playlist", playlistRoute);
router.use("/track", trackRoute);
router.use("/user", userRoute);

router.use((req, res) => {
  res.status(404).send("Bad request");
});

module.exports = router;
