const sequelize = require("../database/models");
const mongodb = require("../database/schema");

module.exports = () => {
  sequelize();
  mongodb();
};
