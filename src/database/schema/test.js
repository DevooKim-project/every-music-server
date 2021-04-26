const mongoose = require("mongoose");

const { Schema } = mongoose;

const testSchema = new Schema({
  num: Number,
  r: { type: Schema.Types.ObjectId, ref: "Test2" },
});

const testSchema2 = new Schema({
  num: Number,
});

const Test = mongoose.model("Test", testSchema);
const Test2 = mongoose.model("Test2", testSchema2);

module.exports = { Test, Test2 };
