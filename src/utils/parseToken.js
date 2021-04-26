const parseToken = (token) => {
  try {
    const newToken = token.replace(/^Bearer\s+/, "");
    return newToken;
  } catch (error) {
    throw error;
  }
};

module.exports = parseToken;
