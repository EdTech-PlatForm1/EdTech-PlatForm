import Joi from "joi";
export const createOrderSchema = Joi.object({
  products: Joi.array().items(
    Joi.object({
      product: Joi.string().required().messages({
        "string.base": "Product ID must be a string",
        "any.required": "Product ID is required"
      }),
      quantity: Joi.number().integer().min(1).required().messages({
        "number.base": "Quantity must be a number",
        "number.min": "Quantity must be at least 1",
        "any.required": "Quantity is required"
      })
    })
  ).min(1).required().messages({
    "array.base": "Products must be an array",
    "array.min": "At least one product is required",
    "any.required": "Products are required"
  }),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    phone: Joi.string().pattern(/^[0-9]{11}$/).required().messages({
      "string.pattern.base": "Phone number must be 11-15 digits"
    })
  }).required(),
  paymentMethod: Joi.string().valid("cash", "card").required().messages({
    "any.only": "Payment method must be either 'cash' or 'card'",
    "any.required": "Payment method is required"
  })
});

export const updateOrderSchema = Joi.object({
  products: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required()
    })
  ).optional(),
  address: Joi.object({
    street: Joi.string().min(3).max(100),
    city: Joi.string().min(2).max(50),
    country: Joi.string().min(2).max(50),
    phone: Joi.string().pattern(/^[0-9]{11}$/).messages({
      "string.pattern.base": "Phone number must be 11-15 digits"
    })
  }).optional(),
  paymentMethod: Joi.string().valid("cash", "card").optional()
});