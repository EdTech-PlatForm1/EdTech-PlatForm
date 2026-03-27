

import mongoose, { model, Schema, Types } from "mongoose";

const wishlistSchema = new Schema({
  products: [{ type: Types.ObjectId, ref: "Product" }],
  guestId: { type: String, required: true, unique: true } 
}, { timestamps: true });

export const wishlistModel = mongoose.models.Wishlist || model("Wishlist", wishlistSchema);