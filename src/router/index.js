const express = require("express");

const authRoute = require("./auth");
const convertRoute = require("./convert");
// const playlistRoute = require("./playlist");
// const userRoute = require("./user");
// const trackRoute = require("./track");

const router = express.Router();

const { Test, Test2 } = require("../database/schema/test");
router.get("/", async (req, res) => {
  const t2 = await Test2.create({ num: 123 });
  const t1 = await Test.create({ num: 456, r: t2 });

  const f = await Test.findOne({ num: 456 });
  console.log(f);
  await f.execPopulate("r");
  console.log(f);
  res.send({ f });
});

router.use("/auth", authRoute);
router.use("/convert", convertRoute);
// router.use("/playlist", playlistRoute);
// router.use("/track", trackRoute);
// router.use("/user", userRoute);

// router.use((req, res) => {
//   res.status(404).send("Bad request");
// });

module.exports = router;
