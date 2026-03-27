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
} from "./products.validation.js";


const router = express.Router();





router.post("/create",  upload.array("images", 5),validate(createProductSchema),createProduct);
router.get("/getAll", getAllProducts);
router.get("/get/:id", getSingleProduct);
router.patch("/softDelete/:id",softDeleteProduct);
router.patch("/restore/:id",restoreProduct);
router.delete("/hardDelete/:id",hardDeleteProduct);

router.patch("/update/:id", upload.array("images", 5),validate(updateProductSchema),updateProduct);
router.post("/addTutorial/:id", validate(addTutorialSchema),addTutorial);
router.patch("/updateTutorial/:id/:tutorialId",validate(updateTutorialSchema),updateTutorial);
router.delete("/deleteTutorial/:id/:tutorialId", deleteTutorial);
router.post("/addChallenge/:id", validate(addChallengeSchema),addChallenge);
router.patch("/updateChallenge/:id/:challengeId", validate(updateChallengeSchema),updateChallenge);
router.delete("/deleteChallenge/:id/:challengeId", deleteChallenge);
router.post('/solvechallenges/:id/:challengeId', solveChallenge);
router.get("/challenges/:id",getChallengesByProduct);

router.get("/Tutorials/:id",getTutorialsByProduct);
router.get("/userProductChallenges/:productId ", getChallengesForUser);
router.get("/userProductTutorials/:productId ", getTutorialsForUser);
export default router;

