const express = require("express");
const morgan = require("morgan");

const { sequelize } = require("./models");
const User = require("./models/user");
const Playlist = require("./models/playlist");

const app = express();

app.set("port", process.env.PORT || 3001);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("mysql connect ok");
  })
  .catch((err) => {
    console.error(err);
  });

app.get("/", async (req, res) => {
  try {
    const user = await User.create({
      email: "email@email.com",
      nick: "nick",
      provider: "provider",
      oAuthId: "oAuth",
    });
    const user2 = await User.create({
      email: "email2@email.com",
      nick: "nick2",
      provider: "provider",
      oAuthId: "oAuth2",
    });
    const playlist = await Playlist.create({
      title: "title",
      owner: user.dataValues.nick,
    });
    const playlist2 = await Playlist.create({
      title: "title2",
      owner: user.dataValues.nick,
    });
    const playlist3 = await Playlist.create({
      title: "title2",
      owner: user2.dataValues.nick,
    });

    const model = await User.findOne({
      include: [
        {
          model: Playlist,
          where: {
            owner: "nick",
          },
        },
      ],
    });

    console.log(model.Playlists);
    // res.status(201).json({ user, user2, playlist, playlist2, playlist3 });
    res.status(201).json({ model });
  } catch (err) {
    console.error(err);
    res.status(404).send({ err });
  }
  // res.send("hello");
});

app.use((req, res, next) => {
  res.status(404).send("Bad request");
});

app.listen(process.env.PORT, () => {
  console.log("port open" + process.env.PORT);
  console.log(process.env.NODE_ENV);
});
