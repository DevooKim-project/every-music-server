const mongoose = require("mongoose");
const config = require("./config");
const logger = require("./logger");

mongoose.connection.on("error", (err) => {
  // throw new Error(`MongoDB connection error: ${err}`);
  logger.error(`MongoDB connection error: ${err}`);
  process.exit(1);
});

if (config.env === "development") {
  mongoose.set("debug", true);
}

exports.connect = () => {
  mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {});
  return mongoose.connection;
};
