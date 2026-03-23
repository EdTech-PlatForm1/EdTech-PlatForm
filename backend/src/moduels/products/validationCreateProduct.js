
import Joi from "joi";

export const createProductSchema = Joi.object({
  productName: Joi.string()
    .min(3)
    .max(100)
    .required()
    .trim()
    .messages({
      "string.base": "Product name must be a string",
      "string.empty": "Product name is required",
      "string.min": "Product name must be at least 3 characters",
      "string.max": "Product name must not exceed 100 characters",
      "any.required": "Product name is required"
    }),

  description: Joi.string()
    .min(10)
    .required()
    .messages({
      "string.empty": "Description is required",
      "string.min": "Description must be at least 10 characters",
      "any.required": "Description is required"
    }),

  price: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be greater than 0",
      "any.required": "Price is required"
    }),

  discount: Joi.number()
    .min(0)
    .max(100)
    .default(0)
    .messages({
      "number.base": "Discount must be a number",
      "number.min": "Discount cannot be less than 0",
      "number.max": "Discount cannot be greater than 100"
    }),

 category: Joi.string()

    .required()
    .messages({

      "any.required": "Category is required"
    }),

  stock: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base": "Stock must be a number",
      "number.min": "Stock cannot be negative"
    })
});