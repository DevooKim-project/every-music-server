const mongoose = require("mongoose");

const { Schema } = mongoose;
const tokenSchema = new Schema({
  accessToken: String,
  refreshToken: String,
  userId: {
    type: String,
    required: true,
  },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("token", tokenSchema);
