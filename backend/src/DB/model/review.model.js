import { Schema,Types ,model} from "mongoose";
import mongoose  from "mongoose";
const reviewschema = new Schema({
  comment: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 500
  },
  user: {
    type: Types.ObjectId,
    ref: "user",
    required: true
  },
  rate: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  product: {
    type: Types.ObjectId,
    ref: "product",
    required: true
  }
}, { timestamps: true });
  export const review =mongoose.models.review ||model("review",reviewschema)
