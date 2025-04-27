const mongoose = require('mongoose');
const { ORDER_ITEM_STATUSES, TODO } = require('../utils/constant');

const orderItemSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, // Quantity must be at least 1
    },
    selectedAddons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Addon',
      },
    ],
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ORDER_ITEM_STATUSES,
      default: TODO,
    },
    assignedChef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true, // createdAt and updatedAt managed automatically
    versionKey: false, // Disables the __v field
  }
);

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;
