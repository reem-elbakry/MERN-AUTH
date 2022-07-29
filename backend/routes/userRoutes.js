const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verify,
  verified,
} = require("../controllers/userController");

router.post("/signup", register);
router.post("/login", login);
router.get("/verify/:userId/:uniqueStr", verify);
router.get("/verified", verified);

module.exports = router;
