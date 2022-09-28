const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verify,
  verified,
  forgetPassword,
  resetPassword,
} = require("../controllers/userController");

router.post("/signup", register);
router.post("/login", login);
router.get("/email/verify/:userId/:uniqueStr", verify);
router.get("/email/verified", verified);
//request >> req >> email & redirect url
//Send password reset link
router.post("/password-reset", forgetPassword);
//Reset user password
router.post("/password-reset/:userId/:resetStr", resetPassword);

module.exports = router;
