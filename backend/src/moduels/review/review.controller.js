import { review } from "./../../DB/model/review.model.js";
import Product from "../../DB/model/products.schema.js";
import { asynchandler } from "../../utils/response/error.response.js";

// create review

export const createReview = asynchandler(async (req, res, next) => {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id; // من token

// preventing repetition

    const existing = await review.findOne({ productId, userId });
    if (existing) {
        return next(new Error("You already reviewed this product", { cause: 400 }));
    }

    const newReview = await review.create({ productId, userId, rating, comment });

    await calcAverage(productId);

    return res.status(201).json({
        message: "Review created successfully",
        review: newReview
    });
});

// get all reviews

export const getAllReviews = asynchandler(async (req, res, next) => {
    const reviews = await review.find().populate("productId").populate("userId", "name email");
    return res.status(200).json({
        message: "Reviews retrieved successfully",
        results: reviews.length,
        reviews
    });
});

// get review by id

export const getReviewById = asynchandler(async (req, res, next) => {
    const { id } = req.params;
    const foundReview = await review.findById(id);
    if (!foundReview) return next(new Error("Review not found", { cause: 404 }));

    return res.status(200).json({
        message: "Review retrieved successfully",
        review: foundReview
    });
});

// update review

export const updateReviewById = asynchandler(async (req, res, next) => {
    const { id } = req.params;
    const updatedReview = await review.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedReview) return next(new Error("Review not found", { cause: 404 }));

    await calcAverage(updatedReview.productId);

    return res.status(200).json({
        message: "Review updated successfully",
        review: updatedReview
    });
});

// delete review

export const deleteReviewById = asynchandler(async (req, res, next) => {
    const { id } = req.params;
    const deletedReview = await review.findByIdAndDelete(id);
    if (!deletedReview) return next(new Error("Review not found", { cause: 404 }));

    await calcAverage(deletedReview.productId);

    return res.status(200).json({ message: "Review deleted successfully" });
});


// average rating

const calcAverage = async (productId) => {
    const stats = await review.aggregate([
        { $match: { productId } },
        {
            $group: {
                _id: "$productId",
                avgRating: { $avg: "$rating" },
                count: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await product.findByIdAndUpdate(productId, {
            averageRating: stats[0].avgRating,
            reviewCount: stats[0].count
        });
    } else {
        await product.findByIdAndUpdate(productId, {
            averageRating: 0,
            reviewCount: 0
        });
    }
};
