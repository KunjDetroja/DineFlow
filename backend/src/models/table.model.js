const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    outletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Outlet',
      required: true,
    },
    tableNumber: {
      type: Number,
      required: true,
    },
    isOccupied: {
      type: Boolean,
      default: false,
    },
    currentOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  },
  {
    timestamps: true, // Manages createdAt and updatedAt
    versionKey: false, // Disables the __v field
  }
);

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
