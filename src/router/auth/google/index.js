const express = require("express");

const auth = require("../../../middleware/auth");
const controller = require("./controller");

const router = express.Router();

router.get("/", controller.withLogin, controller.obtainOAuth); //배포시 post
router.get(
  "/callback",
  controller.withLogin,
  controller.getProviderToken,
  controller.login,
  auth.createLocalToken,
  (req, res) => {
    res.send(req.local_access_token);
  }
);

router.get("/token", controller.withoutLogin, controller.obtainOAuth);
router.get(
  "/callback2",
  auth.isAccessToken,
  auth.verifyToken,
  controller.withoutLogin,
  controller.saveTokenWithoutLogin
);

router.get(
  "/signOut",
  auth.isAccessToken,
  auth.verifyToken,
  controller.signOut
);

//로그아웃은 클라이언트에서 jwt제거

module.exports = router;
