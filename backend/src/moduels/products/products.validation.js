import Joi from "joi";
export const addChallengeSchema = Joi.object({
  id: Joi.string().required(),
  challenge: Joi.string().min(3).required().messages({
    "string.empty": "Challenge cannot be empty",
    "string.min": "Challenge should have at least 3 characters",
    "any.required": "Challenge is required"
  })
});

export const addTutorialSchema = Joi.object({
  id: Joi.string().required(),
  tutorial: Joi.string().min(5).required().messages({
    "string.empty": "Tutorial cannot be empty",
    "string.min": "Tutorial should have at least 5 characters",
    "any.required": "Tutorial is required"
  })
});

export const createProductSchema = Joi.object({
  productName: Joi.string().min(3).max(100).required().trim().messages({
    "string.base": "Product name must be a string",
    "string.empty": "Product name is required",
    "string.min": "Product name must be at least 3 characters",
    "string.max": "Product name must not exceed 100 characters",
    "any.required": "Product name is required"
  }),
  description: Joi.string().min(10).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 10 characters",
    "any.required": "Description is required"
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be greater than 0",
    "any.required": "Price is required"
  }),
  discount: Joi.number().min(0).max(100).default(0).messages({
    "number.base": "Discount must be a number",
    "number.min": "Discount cannot be less than 0",
    "number.max": "Discount cannot be greater than 100"
  }),
  category: Joi.string().required().messages({
    "any.required": "Category is required"
  }),
  stock: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Stock must be a number",
    "number.integer": "Stock must be an integer",
    "number.min": "Stock cannot be negative"
  }),
  images: Joi.array().items(Joi.string().uri()).optional()
});

















export const addChallengeSchema = Joi.object({
  question: Joi.string().min(3).required().messages({
    "string.empty": "Challenge question cannot be empty",
    "string.min": "Challenge question should have at least 3 characters",
    "any.required": "Challenge question is required"
  }),
  correctAnswer: Joi.string().min(1).required().messages({
    "string.empty": "Correct answer cannot be empty",
    "any.required": "Correct answer is required"
  })
});
export const addTutorialSchema = Joi.object({
  title: Joi.string().min(5).required().messages({
    "string.empty": "Tutorial title cannot be empty",
    "string.min": "Tutorial title should have at least 5 characters",
    "any.required": "Tutorial title is required"
  }),
  videoUrl: Joi.string().uri().required().messages({
    "string.uri": "Video URL must be a valid URI",
    "any.required": "Video URL is required"
  }),
  duration: Joi.number().positive().required().messages({
    "number.base": "Duration must be a number",
    "number.positive": "Duration must be greater than 0",
    "any.required": "Duration is required"
  })
});

export const updateChallengeSchema = Joi.object({
  question: Joi.string().min(3).messages({
    "string.base": "Challenge question must be a string",
    "string.min": "Challenge question should have at least 3 characters"
  }),
  correctAnswer: Joi.string().min(1).messages({
    "string.base": "Correct answer must be a string",
    "string.min": "Correct answer cannot be empty"
  }),   
});


export const updateTutorialSchema = Joi.object({
  title: Joi.string().min(5).messages({
    "string.base": "Tutorial title must be a string",
    "string.min": "Tutorial title should have at least 5 characters"
  }),
  videoUrl: Joi.string().uri().messages({
    "string.uri": "Video URL must be a valid URI"
  }),
  duration: Joi.number().positive().messages({
    "number.base": "Duration must be a number",
    "number.positive": "Duration must be greater than 0"
  }),

});

export const updateProductSchema = Joi.object({
  productName: Joi.string().trim().min(3).max(100).messages({
    "string.base": "Product name must be a string",
    "string.empty": "Product name cannot be empty",
    "string.min": "Product name must be at least 3 characters",
    "string.max": "Product name must be less than 100 characters"
  }),
  description: Joi.string().min(10).messages({
    "string.base": "Description must be a string",
    "string.empty": "Description cannot be empty",
    "string.min": "Description must be at least 10 characters"
  }),
  price: Joi.number().positive().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be greater than 0"
  }),
  discount: Joi.number().min(0).max(100).messages({
    "number.base": "Discount must be a number",
    "number.min": "Discount cannot be less than 0",
    "number.max": "Discount cannot be more than 100"
  }),
  category: Joi.string(),
  stock: Joi.number().integer().min(0).messages({
    "number.base": "Stock must be a number",
    "number.integer": "Stock must be an integer",
    "number.min": "Stock cannot be negative"
  }),
  images: Joi.array().items(Joi.string().uri()).optional()
});
