// models/Order.js

const mongoose = require("mongoose");
const {
  ORDER_STATUSES,
  PENDING,
  CUSTOMER,
  WAITER,
} = require("../utils/constant");

const subOrderSchema = new mongoose.Schema({
  orderItemId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    outletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outlet",
      required: true,
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: PENDING,
    },
    orderedBy: {
      type: String,
      enum: [CUSTOMER, WAITER],
      required: true,
    },
    subOrder: [subOrderSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt and updatedAt managed automatically
    versionKey: false, // Disables the __v field
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
