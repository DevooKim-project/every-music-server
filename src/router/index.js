const express = require("express");

const authRoute = require("./auth");
const playlistRoute = require("./playlist");
const boardRoute = require("./board");

const router = express.Router();

const { Test1, Test2 } = require("../database/schema/test1");
router.get("/", async (req, res) => {
  const test1 = await Test1.create({ name: "test1" });
  const test2 = await Test2.create({ name: "test2" });
  await Test1.updateOne({ name: "test1" }, { t1: test2._id });

  const a1 = await Test1.findOne({ name: "test1" });
  const a2 = await Test2.findOne({ name: "test2" });
  console.log(a1);
  console.log(a2);

  const b1 = await Test1.findOne({ name: "test1" }).populate("t1");
  console.log(b1);

  const c2 = await Test2.updateOne({ _id: b1.t1._id }, { name: "change" });
  console.log(c2);

  res.send("home");
});

router.use("/auth", authRoute);
router.use("/playlist", playlistRoute);
router.use("/board", boardRoute);

router.use((req, res) => {
  res.status(404).send("Bad request");
});

module.exports = router;
