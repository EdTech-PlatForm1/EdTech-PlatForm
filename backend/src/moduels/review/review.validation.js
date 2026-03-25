import Joi from "joi";

export const createReviewSchema = Joi.object({
    productId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().allow("")
});

export const updateReviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5),
    comment: Joi.string().allow("")
});