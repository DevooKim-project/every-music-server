const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("./config")[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const User = require("./user");
const Playlist = require("./playlist");

module.exports = () => {
  const db = {};

  db.sequelize = sequelize;
  db.User = User;
  db.Playlist = Playlist;

  User.init(sequelize);
  Playlist.init(sequelize);

  User.associate(db);
  Playlist.associate(db);

  sequelize
    .sync({ force: false })
    .then(() => {
      console.log("mysql connect ok");
    })
    .catch((err) => {
      console.error(err);
    });
};

// module.exports = db;
