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
    default: Date.now() + 3600000, //after 1 hour
  },
});

module.exports = mongoose.model("Verification", verificationSchema);
