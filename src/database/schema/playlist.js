const mongoose = require("mongoose");
const { platformTypes } = require("../../config/type");
const { toJSON } = require("./plugins");
const { Schema } = mongoose;

const playlistSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    thumbnail: String,
    tracks: [{ type: Schema.Types.ObjectId, ref: "Track" }],
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    platform: {
      type: String,
      enum: [platformTypes.YOUTUBE, platformTypes.GOOGLE, platformTypes.SPOTIFY],
    },
    platformId: String,
    visible: {
      type: Boolean,
      default: true,
    },
    like: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

playlistSchema.plugin(toJSON);

playlistSchema.index({ like: -1 });
playlistSchema.index({ owner: 1 });
module.exports = mongoose.model("Playlist", playlistSchema);
