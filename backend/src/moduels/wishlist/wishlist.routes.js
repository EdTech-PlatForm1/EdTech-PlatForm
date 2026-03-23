import { Router } from "express";
import * as wishlistController from "./wishlist.controller.js";
import * as wishlistValidation from "./wishlist.validation.js";
import validation from '../../middleware/validation.js';
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

router.post('/addtowithlist',auth,wishlistController.addToWishlist)
router.delete('/removefromwithlist/:id',auth,wishlistController.removeFromWishlist)
router.get('/getwishlist/:guestId', wishlistController.getWishlist);

export default router;