const mongoose = require("mongoose");

const { Schema } = mongoose;

const trackSchema = new Schema({
  title: {
    kor: { type: String },
    eng: { type: String },
    // required: true,
  },
  album: {
    type: Schema.Types.ObjectId,
    ref: "Album",
  },
  artists: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
  snapShotId: String,
  duration_ms: String,
  providerId: {
    spotify: { type: String },
    youtube: { type: String },
  },
  display: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Track", trackSchema);
