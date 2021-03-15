const dotenv = require("dotenv");
const path = require("path");

module.exports = () => {
  if (process.env.NODE_ENV === "production") {
    dotenv.config({ path: path.join(__dirname, "../../.env.production") });
  } else if (process.env.NODE_ENV === "development") {
    dotenv.config({ path: path.join(__dirname, "../../.env.development") });
  } else {
    throw new Error("process.env.NODE_ENV Not Found");
  }
};
