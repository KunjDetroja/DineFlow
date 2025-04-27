const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema(
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
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
    image: {
      type: String,
    },
    addons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Addon",
      },
    ],
  },
  {
    timestamps: true, // createdAt and updatedAt managed automatically
  }
);

const Dish = mongoose.model("Dish", dishSchema);

module.exports = Dish;
