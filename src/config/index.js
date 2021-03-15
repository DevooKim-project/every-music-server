const dbConfig = require("./dbConfig");
const envConfig = require("./envConfig");

module.exports = () => {
  dbConfig();
  envConfig();
};
