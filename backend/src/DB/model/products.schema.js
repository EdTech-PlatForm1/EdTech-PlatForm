import mongoose from "mongoose";

<<<<<<< HEAD:backend/src/moduels/products/products.schema.js
const productSchema = new mongoose.Schema(
  {
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
      required: true,
      min: 0
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
        title: String,
        videoUrl: String,
        duration: Number
      }
    ],
    challenges: [
      {
        question: String,
        correctAnswer: String
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
      default: 0,
      min: 0,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0
    }
=======
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
>>>>>>> a03151015ba0f96e2a382138c251f296c2ff4bd5:backend/src/DB/model/products.schema.js
  },
  { timestamps: true }
);

productSchema.pre("save", function () {
  this.finalPrice = this.price - (this.price * this.discount) / 100;
});

export default mongoose.model("Product", productSchema);