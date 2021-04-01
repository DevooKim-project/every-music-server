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
  like: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("PlayList", playListSchema);
