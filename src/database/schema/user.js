const mongoose = require("mongoose");

const { Schema } = mongoose;
const userSchema = new Schema({
  email: {
    type: String,
    // unique: true,
  },
  nick: {
    type: String,
  },
  provider: {
    name: {
      type: String,
      enum: ["kakao", "google", "spotify"],
      lowercase: true,
    },
    id: String,
  },
  like_playlists: [{ type: Schema.Types.ObjectId, ref: "Playlist" }],
  private: {
    type: Boolean,
    default: false,
  },
  // token: { type: Schema.Types.ObjectId, ref: "Token" },
});

module.exports = mongoose.model("User", userSchema);
