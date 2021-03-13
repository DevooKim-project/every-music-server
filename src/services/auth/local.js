const jwt = require("jsonwebtoken");
const { parseToken } = require("../../middleware/auth");
const { userService } = require("../database");

const createToken = (user) => {
  const { id, nick, providerId, provider } = user;
  const accessToken = jwt.sign(
    { id, nick, providerId, provider },
    process.env.JWT_SECRET,
    {
      expiresIn: "3m", //50분
    }
  );

  const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1w",
  });

  return { accessToken, refreshToken };
};

const refreshToken = async (localToken) => {
  try {
    const localToken = parseToken(localToken);
    const data = jwt.verify(localToken, process.env.JWT_SECRET);

    const user = await userService.findOneUser({ id: data.id });
    const newToken = this.createLocalToken(user);

    return newToken;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { createToken, refreshToken };
