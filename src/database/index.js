const sequelize = require("./models");
const mongodb = require("./schema");

module.exports = () => {
  sequelize();
  mongodb();
};
