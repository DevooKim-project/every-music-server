const express = require("express");

const { verifyToken } = require("../../../middleware/auth");
const {
  login,
  getProviderToken,
  getLocalToken,
  updateRefreshToken,
  singout,
} = require("./controller");

const router = express.Router();

router.get("/", login);
router.get("/callback", getProviderToken, getLocalToken);

// router.use(verifyToken)
router.get("/refresh/:type", verifyToken, updateRefreshToken);
router.get("/signout", verifyToken, singout);

//로그아웃은 클라이언트에서 jwt제거

module.exports = router;
