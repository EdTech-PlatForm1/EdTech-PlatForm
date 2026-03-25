import { Router } from "express";
const router= Router()
import * as reviews from './review.controller.js'
import {auth }from '../../middleware/auth.middleware.js'
router.post('/addreview',auth,reviews.addreview)
router.get('/getallreview',auth,reviews.getaallreview)
router.get('/getsinglereview/:id',reviews.getsinglereview)
router.put('/updatedreview/:id',auth,reviews.updatereview)
router.delete('/deletereview/:id',auth,reviews.deletereview)
export default router