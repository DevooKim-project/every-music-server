const mongoose = require("mongoose");

const { Schema } = mongoose;
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  nick: {
    type: String,
  },
  provider: {
    provider: {
      type: String,
      enum: ["kakao", "google", "spotify"],
      lowercase: true,
    },
    providerId: String,
  },
  likePlaylists: [{ type: Schema.Types.ObjectId, ref: "Playlist" }],
  private: {
    type: Boolean,
    default: false,
  },
  // token: { type: Schema.Types.ObjectId, ref: "Token" },
});

module.exports = mongoose.model("User", userSchema);
