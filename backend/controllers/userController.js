const User = require("../models/userModel");
const Verification = require("../models/emailVerificationModel");
const Reset = require("../models/passwordResetModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const sendResetEmail = require("../utils/sendResetEmail");
const path = require("path");

/*********************************************REGISTER*************************************/

const register = asyncHandler(async (req, res) => {
  //get data from body
  let { name, email, password } = req.body;

  //trim any white spaces
  name = name.trim();
  email = email.trim();
  password = password.trim();

  //check if any of the vars is empty
  if (!name || !email || !password) {
    throw new Error("all fields are required!");
  } else if (!/^[a-zA-Z ]*$/.test(name)) {
    throw new Error("invalid name entered!");
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    throw new Error("invalid email entered!");
  } else if (password.length < 8) {
    throw new Error("password is too short!");
  } else {
    //check if the user is already exists
    const user = await User.findOne({ email });

    if (user) {
      //user already exists
      res.status(400);
      throw new Error("user with the provided email already exists");
    } else {
      //try to create the user

      //hashing password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      if (user) {
        sendVerificationEmail(user, res);
      } else {
        throw new Error("An error occurred while creating the user!");
      }
    }
  }
});

/*********************************************VERIFY*************************************/

const verify = asyncHandler(async (req, res) => {
  let { userId, uniqueStr } = req.params;

  //check if the verification record is exist
  const verificationData = await Verification.findOne({ userId });

  if (verificationData) {
    //then check for verification expiration
    const { expiresAt } = verificationData;
    const hashedUniqueStr = verificationData.uniqueStr;

    if (expiresAt < Date.now()) {
      //record has expired so we delete it!
      await Verification.deleteOne({ userId });
      await User.deleteOne({ _id: userId });

      let message = "The link has expired, signup again please!";
      res.redirect(`/api/users/email/verified/error=true&message=${message}`);
    } else {
      //valid record
      //need to check the url data is valid
      const isValid = await bcrypt.compare(uniqueStr, hashedUniqueStr);

      if (isValid) {
        //matched strs
        const verifiedUser = await User.findByIdAndUpdate(
          { _id: userId },
          { verified: true },
          { new: true }
        );

        if (verifiedUser) {
          await Verification.deleteOne({ userId });
          res.sendFile(path.join(__dirname, "./../views/verified.html"));
        }
      } else {
        //not valid url data
        let message =
          "Invalid verification details passed, check your inbox please!";
        res.redirect(`/api/users/email/verified/error=true&message=${message}`);
      }
    }
  } else {
    let message =
      "Account record doesn't exist or has been already verified, please try signup or login!";
    res.redirect(`/api/users/email/verified/error=true&message=${message}`);
  }
});

/*********************************************VERIFIED*************************************/

const verified = asyncHandler(async (req, res) => {
  res.sendFile(path.join(__dirname, "./../views/verified.html"));
});

/*********************************************LOGIN*************************************/

const login = asyncHandler(async (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  if (!email || !password) {
    res.status(400);
    throw new Error("invalid credentials!");
  } else {
    //check if user exists
    const user = await User.findOne({ email });

    if (user) {
      //check if verified
      if (!user.verified) {
        res.status(400);
        throw new Error(
          "Email hasn't been verified yet, please check your inbox!"
        );
      } else {
        if (await bcrypt.compare(password, user.password)) {
          res.json({
            status: "success",
            message: "login successful",
            data: user,
            token: generateToken(user._id),
          });
        } else {
          res.status(400);
          throw new Error("incorrect password, try again!");
        }
      }
    } else {
      res.status(400);
      throw new Error("user not found!");
    }
  }
});

/*********************************************FORGET PASSWORD*************************************/

const forgetPassword = asyncHandler(async (req, res) => {
  let { email, redirectUrl } = req.body;
  email = email.trim();

  //check if provided email exists in db

  const user = await User.findOne({ email });

  if (user) {
    //then check if the user is verified
    if (user.verified) {
      //proceed with email to reset password
      sendResetEmail(user, redirectUrl, res);
    } else {
      throw new Error("Email hasn't been verified yet. check your inbox!");
    }
  } else {
    throw new Error("No account with the provided email exists.");
  }
});

module.exports = {
  register,
  verify,
  verified,
  login,
  forgetPassword,
};
