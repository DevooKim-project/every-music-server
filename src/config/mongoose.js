const mongoose = require("mongoose");
const config = require("./config");

mongoose.connection.on("error", (err) => {
  throw new Error(`MongoDB connection error: ${err}`);
});

if (config.env === "development") {
  mongoose.set("debug", true);
}

exports.connect = () => {
  mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {});
  return mongoose.connection;
};

// module.export = connect;
