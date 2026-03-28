import Joi from "joi";

export const signupSchema = Joi.object({
  username: Joi.string().min(3).max(40).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(1024).required(),
  confirmationpassword: Joi.string().valid(Joi.ref('password')).required()
}).required();

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
}).required();

export const confirmEmailSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required()
}).required();
