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
  try {
    const schema = {
      platformIds: Joi.object().keys({
        spotify: Joi.string().required(),
      }),
      // name: Joi.string().required(),
    };

    const data = await artistService.getArtistByName("Green Day");

    // const k = {
    //   platformIds: { spotify: "7oPftvlwr6VrsViSDV7fJY" },
    //   id: "6079fd054eb0002b6cb298ab",
    //   name: "Green Day",
    //   __v: 0,
    // };
    // const n = JSON.parse(data);
    console.log(data);
    const d = data;
    const response = schema.platformIds.validate(d.platformIds, {
      allowUnknown: true,
    });
    console.log(d);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
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
