const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(process.env.PORT, () => {
  console.log("port open" + process.env.PORT);
  console.log(process.env.NODE_ENV);
});
