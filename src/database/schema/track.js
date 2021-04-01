const mongoose = require("mongoose");

const { Schema } = mongoose;

const trackSchema = new Schema({
  title: String,
  artist: { type: Schema.Types.ObjectId, ref: "Artist" },
  thumbnail: String,
  duration_ms: String,
  providerId: {
    spotify: { type: String },
    youtube: { type: String },
  },
});

module.exports = mongoose.model("Track", trackSchema);
