const mongoose = require("mongoose");
const { toJSON } = require("./plugins");
const { Schema } = mongoose;
const artistSchema = new Schema({
  name: String,
  platformIds: {
    spotify: { type: String },
    youtube: { type: String },
  },
});

artistSchema.plugin(toJSON);
module.exports = mongoose.model("Artist", artistSchema);
