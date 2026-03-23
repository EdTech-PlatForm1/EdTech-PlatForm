import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  discount: {
    type: Number,
    default: 0,
      min: 0,
  max: 100
  },
    finalPrice: {
    type: Number,
    default: 0
  },


  tutorials: [
    {
      type: String

    }
  ],
    challenges: [
    {
      type: String
    }
  ],
  images: [
    {
      type: String
    }
  ],
  category: {
    type: String,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    default: 0,
      min: 0
  },

  rating: {
    type: Number,
    default: 0
  },

  reviewsCount: {
    type: Number,
    default: 0
  }

}, { timestamps: true });
productSchema.pre("save", function () {
  this.finalPrice = this.price - (this.price * this.discount / 100);

});


export default mongoose.model("Product", productSchema);