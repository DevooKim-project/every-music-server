const mongoose = require("mongoose");

const { Schema } = mongoose;

const testSchema = new Schema({
  num: Number,
  t: [{ type: Schema.Types.ObjectId, ref: "Test2" }],
});

const test2Schema = new Schema({
  num: Number,
});

const Test = mongoose.model("Test", testSchema);
const Test2 = mongoose.model("Test2", test2Schema);

module.exports = { Test, Test2 };
