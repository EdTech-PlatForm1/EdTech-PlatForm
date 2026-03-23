import Joi from "joi";

export const updateChallengeSchema = Joi.object({
  challenge: Joi.string().min(3).required().messages({
    "string.empty": "Challenge cannot be empty",
    "string.min": "Challenge should have at least 3 characters",
    "any.required": "Challenge is required"
  }),
  index: Joi.number().integer().min(0).required().messages({
    "number.base": "Index must be a number",
    "number.min": "Index cannot be negative",
    "any.required": "Index is required"
  })
});