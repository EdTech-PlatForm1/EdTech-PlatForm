import Joi from "joi";
export const updateTutorialSchema = Joi.object({
  tutorial: Joi.string().min(5).required().messages({
    "string.empty": "Tutorial cannot be empty",
    "string.min": "Tutorial should have at least 5 characters",
    "any.required": "Tutorial is required"
  })
});