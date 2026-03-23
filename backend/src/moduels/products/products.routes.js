import express from "express";
import upload from "../../middleware/multer.upload.js";
import { addChallenge, addTutorial, createProduct, deleteChallenge, deleteTutorial, getAllProducts, getChallengesByProduct, getSingleProduct, getTutorialsByProduct,
     hardDeleteProduct, restoreProduct, softDeleteProduct,
     updateChallenge, updateProduct, updateTutorial } from "./products.controllers.js";
import validate from "../../middleware/validation.js";
import { createProductSchema } from "./validationCreateProduct.js";
import { updateProductSchema } from "./validationUpdateproduct.js";
import { addTutorialSchema } from "./validationAddTutorial.js";
import { updateChallengeSchema } from "./validationUpdateChallenge.js";
import { updateTutorialSchema } from "./validationUpdateTutorial.js";
import { addChallengeSchema } from "./validationAddChallenge.js";




const router = express.Router();





router.post("/api/createproducts",  upload.array("images", 5),validate(createProductSchema),createProduct);
router.get("/api/getAllProducts", getAllProducts);
router.get("/api/getProduct/:id", getSingleProduct);
router.patch("/api/softDeleteProducts/:id",softDeleteProduct);
router.patch("/api/updateProducts/:id", upload.array("images", 5),validate(updateProductSchema),updateProduct);
router.delete("/api/hardDeleteProducts/:id",hardDeleteProduct);
router.patch("/api/restoreProducts/:id",restoreProduct);
router.post("/api/addTutorial/product/:id", validate(addTutorialSchema),addTutorial);
router.put("/api/updateTutorial/product/:id/:index",validate(updateTutorialSchema),updateTutorial);
router.delete("/api/deleteTutorial/product/:id/:index", deleteTutorial);
router.post("/api/addChallenge/product/:id", validate(addChallengeSchema),addChallenge);
router.patch("/api/updateChallenge/:id/:index", validate(updateChallengeSchema),updateChallenge);
router.delete("/api/deleteChallenge/:id/:index", deleteChallenge);
router.get("/api/getChallengesByProduct/:id", getChallengesByProduct);
router.get("/api/getTutorialsByProduct/:id", getTutorialsByProduct);
export default router;

