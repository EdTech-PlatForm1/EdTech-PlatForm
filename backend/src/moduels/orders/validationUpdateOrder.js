import Joi from "joi";

export const updateOrderSchema = Joi.object({
  address: Joi.object({
    street: Joi.string().min(3).max(100).messages({
      "string.base": "Street must be a string",
      "string.empty": "Street is required",
      "string.min": "Street must be at least 3 characters",
      "string.max": "Street must be at most 100 characters"
    }),
    city: Joi.string().min(2).max(50).messages({
      "string.base": "City must be a string",
      "string.empty": "City is required",
      "string.min": "City must be at least 2 characters",
      "string.max": "City must be at most 50 characters"
    }),
    country: Joi.string().min(2).max(50).messages({
      "string.base": "Country must be a string",
      "string.empty": "Country is required",
      "string.min": "Country must be at least 2 characters",
      "string.max": "Country must be at most 50 characters"
    }),
    phone: Joi.string().pattern(/^\d{11}$/).messages({
      "string.pattern.base": "Phone must be 10 to 15 digits"
    })
  }).optional(),

  paymentMethod: Joi.string().valid("cash", "card").messages({
    "any.only": "Payment method must be either 'cash' or 'card'"
  }).optional(),

  products: Joi.array().items(
    Joi.object({
      product: Joi.string().required().messages({
        "string.empty": "Product ID is required"
      }),
      quantity: Joi.number().integer().min(1).required().messages({
        "number.base": "Quantity must be a number",
        "number.min": "Quantity must be at least 1",
        "any.required": "Quantity is required"
      })
    })
  ).optional()
});