const mongoose = require("mongoose");

const Userdbschema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    mobile: {
      type: Number,
      require: true,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "choose one options",
      },
    },
    country: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    img: {
      type: String,
      require: true,
    },
    token: {
      type: String,
      default: " ",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("USER", Userdbschema);
