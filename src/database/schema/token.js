const mongoose = require("mongoose");

const { Schema } = mongoose;
const tokenSchema = new Schema({
  accessTokenGoogle: String,
  accessTokenSpotify: String,
  refreshTokenGoogle: String,
  refreshTokenSpotify: String,
  userId: {
    type: String,
    required: true,
  },
  updatedAt: { type: Date, default: Date.now },
  display: {
    type: Boolean,
    default: true,
  },
});

// const Token = mongoose.model("Token", tokenSchema);
// module.exports = Token;
module.exports = mongoose.model("Token", tokenSchema);
