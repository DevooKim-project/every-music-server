const express = require("express");
const googleRoute = require("./google");
const kakaoRoute = require("./kakao");
// const {
//   isLoggedIn,
//   isNotLoggedIn,
//   verifyToken,
// } = require("../../middleware/auth");

const router = express.Router();

// router.use(isNotLoggedIn);

router.use("/google", googleRoute);
router.use("/kakao", kakaoRoute);

// //test
// router.use("/token", verifyToken, (req, res) => {
//   res.json(req.user);
// });

// router.use("/login", verifyToken, (req, res) => {
//   res.send("login ok");
// });

module.exports = router;
