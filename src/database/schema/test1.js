const mongoose = require("mongoose");

const { Schema } = mongoose;

const test1Schema = new Schema({
  name: String,
  t1: { type: Schema.Types.ObjectId, ref: "Test2" },
});

const test2Schema = new Schema({
  name: String,
});
const Test1 = mongoose.model("Test1", test1Schema);
const Test2 = mongoose.model("Test2", test2Schema);

module.exports = { Test1, Test2 };
