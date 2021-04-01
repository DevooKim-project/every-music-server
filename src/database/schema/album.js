const mongoose = require("mongoose");

const { Schema } = mongoose;
const albumSchema = new Schema({
  title: {
    kor: { type: String },
    eng: { type: String },
    // required: true,
  },
  artists: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
  tracks: [{ type: Schema.Types.ObjectId, ref: "Track" }],
  snapShotId: String,
  providerId: {
    spotify: { type: String },
    youtube: { type: String },
  },
  display: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Album", albumSchema);
