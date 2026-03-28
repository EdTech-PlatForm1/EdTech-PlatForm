import express from "express";
import { cancelOrder, completeRefund, confirmPayment, createOrder, deliverOrder, failOrder, getAllOrders, getOrderStatus, getSingleOrder, getUserOrderHistory, hardDeleteOrder, restoreOrder, returnOrder, shipOrder, softDeleteOrder, updateOrder, getUserTutorials, getUserChallenges } from "./orders.controllers.js";

import validate from "../../middleware/validation.js";
import { createOrderSchema,updateOrderSchema } from "./orders.validation.js";



const router = express.Router();

// User routes
router.post("/create", auth, validate(createOrderSchema), createOrder);
router.get("/history", auth, getUserOrderHistory);
router.get("/tutorials", auth, getUserTutorials);
router.get("/challenges", auth, getUserChallenges);
router.get("/status/:id", auth, getOrderStatus);
router.get("/get/:id", auth, getSingleOrder);
router.patch("/cancel/:id", auth, cancelOrder);
router.patch("/return/:id", auth, returnOrder);

// Admin routes
router.get("/getAll", auth, authorization(['admin']), getAllOrders);
router.patch("/confirm-payment/:id", auth, authorization(['admin']), confirmPayment);
router.patch("/ship/:id", auth, authorization(['admin']), shipOrder);
router.patch("/deliver/:id", auth, authorization(['admin']), markAsDeliveryarrived);
router.patch("/update/:id", auth, authorization(['admin']), validate(updateOrderSchema), updateOrder);
router.patch("/soft-delete/:id", auth, authorization(['admin']), softDeleteOrder);
router.delete("/hard-delete/:id", auth, authorization(['admin']), hardDeleteOrder);
router.patch("/restore/:id", auth, authorization(['admin']), restoreOrder);
router.patch("/fail/:id", auth, authorization(['admin']), failOrder);
router.patch("/complete-refund/:id", auth, authorization(['admin']), completeRefund);

export default router;

