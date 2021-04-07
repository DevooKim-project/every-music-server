const mongoose = require("mongoose");

const { Schema } = mongoose;

const testSchema = new Schema({
  num: Number,
});

module.exports = mongoose.model("Test", testSchema);
