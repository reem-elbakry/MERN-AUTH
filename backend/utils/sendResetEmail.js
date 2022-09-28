const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const PasswordReset = require("../models/passwordResetModel");

const sendResetEmail = asyncHandler(async ({ _id, email }, res) => {
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

  const url = process.env.BASE_URL;

  //use _id + generated uuid
  const resetStr = uuidv4() + _id;

  //hash the resetStr before storing it in db
  const salt = await bcrypt.genSalt(10);
  const hashedResetStr = await bcrypt.hash(resetStr, salt);

  /**clear records matching this id in resetPassword collection
   * because user can request for multiple password reset at the time
   * so when the user make request >> i get rid of the exists record data
   */

  const resetRecord = await PasswordReset.deleteOne({ userId: _id });

  if (resetRecord) {
    //then send the email
    //mail options
    const mailOptions = {
      from: process.env.AUTH_USER,
      to: email,
      subject: "Reset Your Password",
      html: `<p>We heard that you lost your password.</p>
               <p>Don't worry use the link below to reset it.</p>
               <p>This link <b>expires in 1 hour</b>.</p>
               <p>Press 👉 <a href=${
                 url + "api/users/email/verify/" + _id + "/" + resetStr
               }>here</a> to proceed.</p>`,
    };

    //set values in PasswordReset collection
    const passwordReset = await PasswordReset.create({
      userId: _id,
      resetStr: hashedResetStr,
    });

    //if mail verification data stored .. send verification mail
    if (passwordReset) {
      await transporter.sendMail(mailOptions);

      res.json({
        status: "pending",
        message: "password reset email sent!",
      });
    }
  }
});

module.exports = sendResetEmail;
