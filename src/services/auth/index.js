const jwt = require("jsonwebtoken");

const createToken = ({ id, nick }) => {
  const token = jwt.sign({ id, nick }, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });

  return token;
};

module.exports = createToken;
