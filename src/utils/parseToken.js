const parseToken = (token) => {
  const newToken = token.replace(/^Bearer\s+/, "");
  return newToken;
};

module.exports = parseToken;
