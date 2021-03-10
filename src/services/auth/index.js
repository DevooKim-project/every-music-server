const jwt = require("jsonwebtoken");

const createToken = ({ id, nick }) => {
  const accessToken = jwt.sign({ id, nick }, process.env.JWT_SECRET, {
    expiresIn: "3m",
  });

  // const refreshToken = jwt.sign

  return accessToken;
};

module.exports = createToken;
