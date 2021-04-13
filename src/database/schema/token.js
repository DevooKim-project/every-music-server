const mongoose = require("mongoose");
const { platformTypes } = require("../../config/type");

const { Schema } = mongoose;
const tokenSchema = new Schema({
  provider: {
    type: String,
    enum: [platformTypes.KAKAO, platformTypes.GOOGLE, platformTypes.SPOTIFY],
    lowercase: true,
  },
  access_token: String,
  refresh_token: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date, default: Date.now },
});

// const Token = mongoose.model("Token", tokenSchema);
// module.exports = Token;
module.exports = mongoose.model("Token", tokenSchema);
