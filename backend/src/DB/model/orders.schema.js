import mongoose from "mongoose";

const orderschema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          min: 0,
          default: 0,
        },
      },
    ],

    subtotal: { type: Number, default: 0, min: 0 },
    shippingCost: { type: Number, default: 0, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },

    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },

    refundStatus: {
      type: String,
      enum: ["none", "requested", "completed"],
      default: "none",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "waiting_payment",
        "paid",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
        "failed",
      ],
      default: "pending",
    },
    refundAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    paidAmount: { type: Number, default: 0, min: 0 },
    finalCollected: { type: Number, default: 0, min: 0 },
    penalty: { type: Number, default: 0, min: 0 },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      required: true,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderschema);
