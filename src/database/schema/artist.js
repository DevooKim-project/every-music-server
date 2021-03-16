const mongoose = require("mongoose");

const { Schema } = mongoose;
const artistSchema = new Schema({
  name: String,
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

module.exports = mongoose.model("Artist", artistSchema);
