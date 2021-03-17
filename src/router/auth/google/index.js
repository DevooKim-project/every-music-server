const express = require("express");

const { verifyToken } = require("../../../middleware/auth");
const {
  login,
  getServiceToken,
  getLocalToken,
  refreshToken,
  singout,
} = require("./controller");

const router = express.Router();

router.get("/", login);
router.get("/callback", getServiceToken, getLocalToken);

// router.use(verifyToken)
router.get("/refresh/:type", verifyToken, refreshToken);
router.get("/signout", verifyToken, singout);

//로그아웃은 클라이언트에서 jwt제거

module.exports = router;
