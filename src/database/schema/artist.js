const mongoose = require("mongoose");

const { Schema } = mongoose;
const artistSchema = new Schema({
  name: String,
  provider_id: {
    spotify: { type: String },
    youtube: { type: String },
  },
});

module.exports = mongoose.model("Artist", artistSchema);
