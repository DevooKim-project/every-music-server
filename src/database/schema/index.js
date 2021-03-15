// const mongoose = require("mongoose");
// const e = require("express");
// mongoose.connect(`mongodb://mongo/${process.env.DB}`, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
// });

// const db = mongoose.connection;
// db.on("error", () => console.error("mongoose error"));
// db.once("open", () => {
//   console.log("mongoose ok");
// });

// const { Schema } = mongoose;
// const testSchema = new Schema({
//   name: String,
// });

// const TestModel = mongoose.model("Test", testSchema);

// TestModel.create({ name: "testName" });

// TestModel.find({}, (err, data) => {
//   if (err) throw err;
//   else {
//     console.log(data);
//   }
// });

const mongoose = require("mongoose");

const connect = () => {
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }
  mongoose.connect(
    `mongodb://mongo/${process.env.DB}`,
    {
      dbName: process.env.DB,
      useNewUrlParser: true,
      useCreateIndex: true,
    },
    (error) => {
      if (error) {
        console.log("mongodb connect error", error);
      } else {
        console.log("mongodb connect ok");
      }
    }
  );
};

mongoose.connection.on("error", (error) => {
  console.log("mongodb connect error", error);
});

mongoose.connection.on("disconnected", () => {
  console.error("retry mongodb connect");
  connect();
});

module.exports = connect;
