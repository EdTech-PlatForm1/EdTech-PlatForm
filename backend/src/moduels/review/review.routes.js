import express from "express"
import * as reviewController from "./review.controller.js"
import { validation } from "../../middleware/validation.js"
import { createReviewSchema, updateReviewSchema } from "./review.validation.js"
import { auth } from "../../middleware/auth.middleware.js"

const router = express.Router()

router.post("/review", auth, validation(createReviewSchema), reviewController.createReview)
router.get("/reviewAll", reviewController.getAllReviews)
router.get("/review/:id", reviewController.getReviewById)
router.put("/review/:id", auth, validation(updateReviewSchema), reviewController.updateReviewById)
router.delete("/review/:id", auth, reviewController.deleteReviewById)

export default router