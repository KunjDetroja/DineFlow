const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfOutlets: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
    },
  },
  {
    timestamps: true, // createdAt and updatedAt managed automatically
    versionKey: false, // Disables the __v field
  }
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);

module.exports = Inquiry;
