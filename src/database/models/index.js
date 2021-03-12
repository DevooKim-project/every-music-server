const Sequelize = require("sequelize");
const { DataType } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../../config/dbConfig")[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const User = require("./user");
const Playlist = require("./playlist");

const db = {};

db.sequelize = sequelize;
db.User = User;
db.Playlist = Playlist;

User.init(sequelize);
Playlist.init(sequelize);

User.associate(db);
Playlist.associate(db);

module.exports = db;
