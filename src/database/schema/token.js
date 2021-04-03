const mongoose = require("mongoose");

const { Schema } = mongoose;
const tokenSchema = new Schema({
  provider: {
    type: String,
    enum: ["kakao", "google", "spotify"],
    lowercase: true,
  },
  accessToken: String,
  refreshToken: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date, default: Date.now },
});

// const Token = mongoose.model("Token", tokenSchema);
// module.exports = Token;
module.exports = mongoose.model("Token", tokenSchema);
