const createToken = require("../../services/auth");

const getToken = (req, res) => {
  const token = createToken(req.user);
  res.status(200).json(token);
};

module.exports = getToken;
