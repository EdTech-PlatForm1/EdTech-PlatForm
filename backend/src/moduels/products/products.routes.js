import express from "express";
import upload from "../../middleware/multer.upload.js";
import { addChallenge, addTutorial, createProduct, deleteChallenge, 
    deleteTutorial, getAllProducts, getChallengesByProduct, getChallengesForUser, 
    getSingleProduct, getTutorialsByProduct, getTutorialsForUser, 
    hardDeleteProduct, restoreProduct, softDeleteProduct, solveChallenge, updateChallenge, updateProduct, updateTutorial } from "./products.controllers.js";
import validate from "../../middleware/validation.js";

import { createProductSchema,updateProductSchema,
    addTutorialSchema ,updateChallengeSchema,
updateTutorialSchema,addChallengeSchema
} from "../../validation/validation.js";


const router = express.Router();





router.post("/api/createproducts",  upload.array("images", 5),validate(createProductSchema),createProduct);
router.get("/api/getAllProducts", getAllProducts);
router.get("/api/getProduct/:id", getSingleProduct);
router.patch("/api/softDeleteProducts/:id",softDeleteProduct);
router.patch("/api/restoreProducts/:id",restoreProduct);
router.delete("/api/hardDeleteProducts/:id",hardDeleteProduct);

router.patch("/api/updateProducts/:id", upload.array("images", 5),validate(updateProductSchema),updateProduct);
router.post("/api/addTutorial/product/:id", validate(addTutorialSchema),addTutorial);
router.patch("/api/updateTutorial/product/:id/:tutorialId",validate(updateTutorialSchema),updateTutorial);
router.delete("/api/deleteTutorial/product/:id/:tutorialId", deleteTutorial);
router.post("/api/addChallenge/product/:id", validate(addChallengeSchema),addChallenge);
router.patch("/api/updateChallenge/:id/:challengeId", validate(updateChallengeSchema),updateChallenge);
router.delete("/api/deleteChallenge/:id/:challengeId", deleteChallenge);
router.post('/api/products/solvechallenges/:id/:challengeId', solveChallenge);
router.get("/api/product/challenges/:id",getChallengesByProduct);

router.get("/api/product/Tutorials/:id",getTutorialsByProduct);
router.get("/api/userProductChallenges/:productId ", getChallengesForUser);
router.get("/api/userProductTutorials/:productId ", getTutorialsForUser);
export default router;

