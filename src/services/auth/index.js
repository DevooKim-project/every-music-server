const jwt = require("jsonwebtoken");

const createToken = (user) => {
  const { id, nick, providerId, provider } = user;
  const accessToken = jwt.sign(
    { id, nick, providerId, provider },
    process.env.JWT_SECRET,
    {
      expiresIn: "3m",
    }
  );

  const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1w",
  });

  return { accessToken, refreshToken };
};

module.exports = createToken;
