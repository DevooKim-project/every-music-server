const express = require("express");

const authRoute = require("./auth");
const convertRoute = require("./convert");
// const playlistRoute = require("./playlist");
// const userRoute = require("./user");
// const trackRoute = require("./track");

const router = express.Router();

const Joi = require("joi");
const { artistService } = require("../services");
router.get("/", async (req, res) => {
  const a = { platformIds: { spotify: "6ORqU0bHbVCRjXm9AjyHyZ" } };
  const b = a.platformIds;
  console.log(Object.prototype.hasOwnProperty.call(b, "spotify"));
  res.send();
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
