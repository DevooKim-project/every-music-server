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
  owner: String,
  providerId: String,
  provider: String,
  display: {
    type: Boolean,
    default: true,
  },
});
// playlistSchema.index({ like: 1 });
playlistSchema.index({ owner: 1 });
module.exports = mongoose.model("Playlist", playlistSchema);
