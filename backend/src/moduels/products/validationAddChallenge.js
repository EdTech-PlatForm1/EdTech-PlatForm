import Joi from "joi";
export const addChallengeSchema = Joi.object({
  challenge: Joi.string().min(3).required().messages({
    "string.empty": "Challenge cannot be empty",
    "string.min": "Challenge should have at least 3 characters",
    "any.required": "Challenge is required"
  })
});