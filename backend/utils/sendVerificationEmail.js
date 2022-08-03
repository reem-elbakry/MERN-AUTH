const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Verification = require("../models/emailVerificationModel");

const sendVerificationEmail = asyncHandler(async ({ _id, email }, res) => {
  //carry the message from source to destination
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE, //
    port: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.SECURE),
    auth: {
      //
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASS,
    },
  });

  //url to be used in email
  const url = process.env.BASE_URL;

  //use _id + generated uuid
  const uniqueStr = uuidv4() + _id;

  //hash the uniqueStr
  const salt = await bcrypt.genSalt(10);
  const hashedUniqueStr = await bcrypt.hash(uniqueStr, salt);

  //mail options
  const mailOptions = {
    from: process.env.AUTH_USER,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Verify your email address to complete the signup and login to your account.</p>
               <p>This link <b>expires in 1 hour</b>.</p>
               <p>Press 👉 <a href=${
                 url + "api/users/verify/" + _id + "/" + uniqueStr
               }>here</a> to proceed.</p>`,
  };

  //set values in Verification collection
  const verification = await Verification.create({
    userId: _id,
    uniqueStr: hashedUniqueStr,
  });

  //if mail verification data stored .. send verification mail
  if (verification) {
    await transporter.sendMail(mailOptions);

    res.json({
      status: "pending",
      message: "verification email sent!",
    });
  }
});

module.exports = sendVerificationEmail;
