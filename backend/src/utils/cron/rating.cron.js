import cron from "node-cron";
import { review } from "../../DB/model/review.model.js";
import { product } from "../DB/model/product.model.js";

cron.schedule("0 0 * * *", async () => {
    try {
        console.log("Running rating cron job...");

        const stats = await review.aggregate([
            {
                $group: {
                    _id: "$productId",
                    avgRating: { $avg: "$rating" },
                    count: { $sum: 1 }
                }
            }
        ]);

        for (let item of stats) {
            await product.findByIdAndUpdate(item._id, {
                averageRating: item.avgRating,
                reviewCount: item.count
            });
        }

        console.log("Ratings updated!");
    } catch (error) {
        console.error("Cron job error:", error);
    }
});