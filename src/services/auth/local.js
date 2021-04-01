const jwt = require("jsonwebtoken");
const { parseToken } = require("../../middleware/auth");
const { userService } = require("../database");

const createToken = (user) => {
  const { id, nick, providerId, provider } = user;
  const accessToken = jwt.sign(
    { id, nick, providerId, provider },
    process.env.JWT_SECRET,
    {
      // expiresIn: "10m", //50분
    }
  );

  const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1w",
  });

  console.log("local-access: ", accessToken);
  console.log("refresh-access: ", refreshToken);

  return { accessToken, refreshToken };
};

const refreshToken = async (token) => {
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

module.exports = { createToken, refreshToken };
