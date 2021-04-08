const mongoose = require("mongoose");

const { Schema } = mongoose;
const playlistSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  thumbnail: String,
  tracks: [{ type: Schema.Types.ObjectId, ref: "Track" }],
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  provider_id: String,
  provider: String,
  private: {
    type: Boolean,
    default: false,
  },
  like: {
    type: Number,
    default: 0,
  },
});
playlistSchema.index({ like: 1 });
playlistSchema.index({ owner: 1 });
module.exports = mongoose.model("Playlist", playlistSchema);
