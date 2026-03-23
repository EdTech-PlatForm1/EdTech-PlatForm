import Joi from "joi";

export const updateProductSchema = Joi.object({
  productName: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .messages({
      "string.base": "Product name must be a string",
      "string.empty": "Product name cannot be empty",
      "string.min": "Product name must be at least 3 characters",
      "string.max": "Product name must be less than 100 characters"
    }),

  description: Joi.string()
    .min(10)
    .messages({
      "string.base": "Description must be a string",
      "string.empty": "Description cannot be empty",
      "string.min": "Description must be at least 10 characters"
    }),

  price: Joi.number()
    .positive()
    .messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be greater than 0"
    }),

  discount: Joi.number()
    .min(0)
    .max(100)
    .messages({
      "number.base": "Discount must be a number",
      "number.min": "Discount cannot be less than 0",
      "number.max": "Discount cannot be more than 100"
    }),

  category: Joi.string()

,
  stock: Joi.number()
    .integer()
    .min(0)
    .messages({
      "number.base": "Stock must be a number",
      "number.integer": "Stock must be an integer",
      "number.min": "Stock cannot be negative"
    }),

});

