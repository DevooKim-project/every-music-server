const mongoose = require("mongoose");
const { toJSON } = require("./plugins");
const { Schema } = mongoose;

const trackSchema = new Schema({
  title: String,
  artist: { type: Schema.Types.ObjectId, ref: "Artist" },
  thumbnail: String,
  platformIds: {
    spotify: { type: String },
    google: { type: String },
  },
});

trackSchema.plugin(toJSON);

module.exports = mongoose.model("Track", trackSchema);
