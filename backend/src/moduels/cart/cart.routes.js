import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import * as cart from './cart.controller.js'

const router=Router()
router.post('/add',auth,cart.addProductToCart)
router.delete('/delete/:id',auth,cart.removeProductFromCart)
router.delete('/clear',auth,cart.clearUserCart)
router.get('/get',auth,cart.getUserCart)
export default router
