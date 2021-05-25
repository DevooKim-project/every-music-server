const app = require("./app");
const config = require("./config/config");
const mongoose = require("./config/mongoose");

mongoose.connect();
app.listen(config.port, () => {
  console.log("Server open: ", config.port);
  console.log("ENV: ", config.env);
});
