const jwt = require("jsonwebtoken");
const { parseToken } = require("../../middleware/auth");
const { userService } = require("../database");

const createToken = (user) => {
  const { id, nick, provider } = user;
  const access_token = jwt.sign(
    { id, nick, provider },
    process.env.JWT_SECRET,
    {
      expiresIn: "10m", //60분
    }
  );

  const refresh_token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1w",
  });

  return { access_token, refresh_token };
};

const updateRefreshToken = async (token) => {
  try {
    const localToken = parseToken(token);
    const data = jwt.verify(localToken, process.env.JWT_SECRET);

    console.log(data);
    const user = await userService.findOneUser({ id: data.id });
    console.log(user);
    const newToken = createToken(user);

    console.log("local-newAccess: ", newToken);
    return newToken;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { createToken, updateRefreshToken };
