import Joi from "joi";
import mongoose from "mongoose";

export const createOrderSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        product: Joi.string()
          .required()
          .messages({
            "string.base": "Product ID must be a string",
            "string.empty": "Product ID is required",
            "any.required": "Product ID is required"
          }),
        quantity: Joi.number()
          .integer()
          .min(1)
          .required()
          .messages({
            "number.base": "Quantity must be a number",
            "number.min": "Quantity must be at least 1",
            "any.required": "Quantity is required"
          })
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Products must be an array",
      "array.min": "At least one product is required",
      "any.required": "Products are required"
    }),

  address: Joi.object({
    street: Joi.string().min(3).max(100).required().messages({
      "string.base": "Street must be a string",
      "string.empty": "Street is required",
      "string.min": "Street must be at least 3 characters",
      "string.max": "Street must be at most 100 characters",
      "any.required": "Street is required"
    }),
    city: Joi.string().min(2).max(50).required().messages({
      "string.base": "City must be a string",
      "string.empty": "City is required",
      "string.min": "City must be at least 2 characters",
      "string.max": "City must be at most 50 characters",
      "any.required": "City is required"
    }),
    country: Joi.string().min(2).max(50).required().messages({
      "string.base": "Country must be a string",
      "string.empty": "Country is required",
      "string.min": "Country must be at least 2 characters",
      "string.max": "Country must be at most 50 characters",
      "any.required": "Country is required"
    }),
    phone: Joi.string().pattern(/^\d{11}$/).required().messages({
      "string.pattern.base": "Phone must be exactly 11 digits",
      "string.empty": "Phone is required",
      "any.required": "Phone is required"
    })
  }).required(),

  paymentMethod: Joi.string()
    .valid("cash", "card")
    .required()
    .messages({
      "any.only": "Payment method must be either 'cash' or 'card'",
      "any.required": "Payment method is required"
    })
});