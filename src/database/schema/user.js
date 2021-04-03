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
    provider: { type: String, enum: ["kakao", "google", "spotify"] },
    providerId: String,
  },
  likePlaylist: [{ type: Schema.Types.ObjectId, ref: "Playlist" }],
});

module.exports = mongoose.model("User", userSchema);
