const mongoose = require("mongoose");

const verificationSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },

  uniqueStr: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  expiresAt: {
    type: Date,
    default: Date.now() + 21600000, //after 6 hours
  },
});

module.exports = mongoose.model("Verification", verificationSchema);
