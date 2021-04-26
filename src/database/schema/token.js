const mongoose = require("mongoose");
const { platformTypes } = require("../../config/type");
const { toJSON } = require("./plugins");

const { Schema } = mongoose;
const tokenSchema = new Schema({
  platform: {
    type: String,
    enum: [platformTypes.KAKAO, platformTypes.GOOGLE, platformTypes.SPOTIFY],
  },
  accessToken: String,
  refreshToken: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date, default: Date.now },
});

tokenSchema.plugin(toJSON);
// const Token = mongoose.model("Token", tokenSchema);
// module.exports = Token;
module.exports = mongoose.model("Token", tokenSchema);
