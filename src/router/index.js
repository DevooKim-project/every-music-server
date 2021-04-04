const express = require("express");

const authRoute = require("./auth");
const playlistRoute = require("./playlist");
const boardRoute = require("./board");

const router = express.Router();

const { Test, Test2 } = require("../database/schema/test");
router.get("/", async (req, res) => {
  const t1 = await Test.create({ num: 1 });
  const t2 = await Test2.create({ num: 123 });
  const t3 = await Test2.create({ num: 456 });
  const t4 = await Test2.create({ num: 789 });
  await Test.updateOne(
    { _id: t1._id },
    { $addToSet: { t: { $each: [t2._id, t3._id, t4._id] } } }
  );

  await Test.updateOne({ _id: t1._id }, { $pullAll: { t: [t3._id] } });

  const b = await Test.findOne({ _id: t1._id }).populate("t");
  console.log(b);
  console.log(b.t);
  res.send("home");
});

router.use("/auth", authRoute);
router.use("/playlist", playlistRoute);
router.use("/board", boardRoute);

router.use((req, res) => {
  res.status(404).send("Bad request");
});

module.exports = router;
