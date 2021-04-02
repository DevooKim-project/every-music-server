const mongoose = require("mongoose");

const { Schema } = mongoose;
const playlistLikeSchema = new Schema({
  playlist: {
    type: Schema.Types.ObjectId,
    ref: "Playlist",
  },
  like: {
    type: Number,
    default: 0,
  },
  user: [{ type: String }],
});
playlistLikeSchema.index({ like: 1 });
module.exports = mongoose.model("PlaylistLike", playlistLikeSchema);
