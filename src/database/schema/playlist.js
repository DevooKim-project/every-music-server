const mongoose = require("mongoose");
const { toJSON } = require("./plugins");
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
  platform: String,
  platformId: String,
  private: {
    type: Boolean,
    default: false,
  },
  like: {
    type: Number,
    default: 0,
  },
});

playlistSchema.plugin(toJSON);

playlistSchema.index({ like: -1 });
playlistSchema.index({ owner: 1 });
module.exports = mongoose.model("Playlist", playlistSchema);
