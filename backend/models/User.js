const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    isAdmin: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: String,
      default: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=b6e3f4"
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);