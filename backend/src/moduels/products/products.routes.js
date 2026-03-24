import express from "express";
import upload from "../../middleware/multer.upload.js";
import { addChallenge, addTutorial, createProduct, deleteChallenge, deleteTutorial, getAllProducts, getChallengesByProduct, getSingleProduct, getTutorialsByProduct,
     hardDeleteProduct, restoreProduct, softDeleteProduct,
     updateChallenge, updateProduct, updateTutorial } from "./products.controllers.js";
import validate from "../../middleware/validation.js";
import { createProductSchema, updateProductSchema, addTutorialSchema, updateChallengeSchema, updateTutorialSchema, addChallengeSchema } from "./products.validation.js";
import { auth, authorization } from "../../middleware/auth.middleware.js";


const router = express.Router();


router.get("/getAll", getAllProducts);
router.get("/get/:id", getSingleProduct);
router.get("/getChallenges/:id", getChallengesByProduct);
router.get("/getTutorials/:id", getTutorialsByProduct);

// Admin-only management routes
router.post("/create", auth, authorization(['admin']), upload.array("images", 5), validate(createProductSchema), createProduct);
router.patch("/softDelete/:id", auth, authorization(['admin']), softDeleteProduct);
router.patch("/update/:id", auth, authorization(['admin']), upload.array("images", 5), validate(updateProductSchema), updateProduct);
router.delete("/hardDelete/:id", auth, authorization(['admin']), hardDeleteProduct);
router.patch("/restore/:id", auth, authorization(['admin']), restoreProduct);
router.post("/addTutorial/:id", auth, authorization(['admin']), validate(addTutorialSchema), addTutorial);
router.put("/updateTutorial/:id/:index", auth, authorization(['admin']), validate(updateTutorialSchema), updateTutorial);
router.delete("/deleteTutorial/:id/:index", auth, authorization(['admin']), deleteTutorial);
router.post("/addChallenge/:id", auth, authorization(['admin']), validate(addChallengeSchema), addChallenge);
router.patch("/updateChallenge/:id/:index", auth, authorization(['admin']), validate(updateChallengeSchema), updateChallenge);
router.delete("/deleteChallenge/:id/:index", auth, authorization(['admin']), deleteChallenge);

export default router;

