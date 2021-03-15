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
});

module.exports = mongoose.model("token", tokenSchema);
