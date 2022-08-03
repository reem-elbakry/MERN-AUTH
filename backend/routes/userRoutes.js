const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verify,
  verified,
  forgetPassword,
} = require("../controllers/userController");

router.post("/signup", register);
router.post("/login", login);
router.get("/email/verify/:userId/:uniqueStr", verify);
router.get("/email/verified", verified);
//request >> req >> email & redirect url
router.post("/forgot-password", forgetPassword);

module.exports = router;
