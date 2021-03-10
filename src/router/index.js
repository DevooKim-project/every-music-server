const express = require("express");
const authRoute = require("./auth");
const User = require("../models/user");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("home");
});
router.use("/auth", authRoute);

router.get("/login", async (req, res) => {
  console.log(req.isAuthenticated());
  const user = await User.findAll({});
  console.log(user);
  res.send("login");
});

router.get("/logout", (req, res) => {
  console.log(req.isAuthenticated());
  User.findAll({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.error(error);
      res.send("sssss");
    });
  res.send("logout");
});

router.use((req, res) => {
  res.status(404).send("Bad request");
});

module.exports = router;
