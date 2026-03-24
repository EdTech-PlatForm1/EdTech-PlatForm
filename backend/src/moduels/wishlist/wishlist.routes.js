import { Router } from "express";
import * as wishlistController from "./wishlist.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

router.post('/add', auth, wishlistController.addToWishlist)
router.delete('/remove', auth, wishlistController.removeFromWishlist)
router.get('/get/:guestId', wishlistController.getWishlist);

export default router;