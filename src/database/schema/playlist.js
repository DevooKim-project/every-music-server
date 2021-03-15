const mongoose = require("mongoose");

const { Schema } = mongoose;
const playListSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  snapShotId: String,
  tracks: [{ type: Schema.Types.ObjectId, ref: "Track" }],
  private: {
    type: Boolean,
    default: true,
  },
  owner: String,
  providerId: {
    spotify: { type: String },
    youtube: { type: String },
  },
});

module.exports = mongoose.model("PlayList", playListSchema);
