const mongoose = require("mongoose");

const { Schema } = mongoose;
const playListSchema = new Schema({
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
// playListSchema.index({ like: 1 });
playListSchema.index({ owner: 1 });
module.exports = mongoose.model("Playlist", playListSchema);
