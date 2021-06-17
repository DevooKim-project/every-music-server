const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");
const mongoose = require("./config/mongoose");

mongoose.connect();
app.listen(config.port, () => {
  logger.info(`Server open: ${config.port} / ${config.env}`);
});
