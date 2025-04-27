const mongoose = require("mongoose");

const addonSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    outletId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Outlet",
        required: true,
      },
    ],
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt and updatedAt managed automatically
    versionKey: false, // Disables the __v field
  }
);

const Addon = mongoose.model("Addon", addonSchema);

module.exports = Addon;
