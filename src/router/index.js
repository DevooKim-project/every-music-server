const express = require("express");

// const authRoute = require("./auth");
// const convertRoute = require("./convert");
// const playlistRoute = require("./playlist");
// const userRoute = require("./user");
// const trackRoute = require("./track");

const router = express.Router();

const { Playlist } = require("../database/schema");

const getPlaylistById = async (id) => {
  return Playlist.findById(id);
};

const deletePlaylistById = async (playlistId) => {
  return Playlist.deleteMany({ id: playlistId });
  return;
};

router.get("/", async (req, res) => {
  const playlist = await deletePlaylistById("607082272bc391abcdf7b1af");
  console.log(playlist);
  res.send(playlist);
});

// router.use("/auth", authRoute);
// router.use("/convert", convertRoute);
// router.use("/playlist", playlistRoute);
// router.use("/track", trackRoute);
// router.use("/user", userRoute);

// router.use((req, res) => {
//   res.status(404).send("Bad request");
// });

module.exports = router;
