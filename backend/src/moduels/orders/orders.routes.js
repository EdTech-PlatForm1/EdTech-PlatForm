import express from "express";
import { cancelOrder, completeRefund, confirmPayment, 
    createOrder, failOrder, getAllOrders,
     getOrderStatus, getSingleOrder, getUserOrderHistory, hardDeleteOrder, markAsDeliveryarrived, markAsDeliveryFailed, restoreOrder, returnOrder, setShippingCost, shipOrder, softDeleteOrder, updateOrder } from "./orders.controllers.js";

import validate from "../../middleware/validation.js";
import { createOrderSchema,updateOrderSchema } from "../../validation/validation.js";



const router = express.Router();





router.post("/api/createorders", validate(createOrderSchema), createOrder);
router.patch('/api/shippingorders/:id',setShippingCost);
router.patch("/api/confirm-payment/:id", confirmPayment);
router.patch("/api/ship/:id", shipOrder);
router.patch("/api/accept-deliver/:id", markAsDeliveryarrived);
router.patch("/api/faildeliver/:id", markAsDeliveryFailed);
router.get("/api/getAllOrders", getAllOrders);
router.get("/api/getsingleOrder/:id", getSingleOrder);
router.patch("/api/update-order/:id" ,validate(updateOrderSchema), updateOrder);

router.patch("/api/soft-delete/:id", softDeleteOrder);
router.delete("/api/hard-delete/:id", hardDeleteOrder);
router.patch("/api/restore/:id", restoreOrder);
router.get("/api/historyOrder", getUserOrderHistory);
router.get("/api/statusOrder/:id", getOrderStatus);



router.patch("/api/cancelOrder/:id", cancelOrder);
router.patch("/api/returnOrder/:id", returnOrder);
router.patch("/api/failOrder/:id", failOrder);
router.patch("/api/complete-refund/:id", completeRefund);

export default router;

