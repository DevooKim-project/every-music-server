const jwt = require("jsonwebtoken");
const { parseToken } = require("../../middleware/auth");
const { userService } = require("../database");

exports.createToken = (user) => {
  const { id, nick, provider } = user;
  const access_token = jwt.sign(
    // { id, nick, provider },
    {
      iss: "everyMusic.com",
      user_name: nick,
      user_id: id,
      provider_name: provider.name,
      provider_id: provider.id,
    },
    process.env.JWT_SECRET,
    {
      // expiresIn: "10m", //60분
    }
  );

  const refresh_token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1w",
  });

  return { access_token, refresh_token };
};

exports.updateRefreshToken = async (token) => {
  try {
    const localToken = parseToken(token);
    const data = jwt.verify(localToken, process.env.JWT_SECRET);

    console.log(data);
    const user = await userService.findOneUser({ id: data.id });
    console.log(user);
    const newToken = this.createToken(user);

    console.log("local-newAccess: ", newToken);
    return newToken;
  } catch (error) {
    throw new Error(error);
  }
};
