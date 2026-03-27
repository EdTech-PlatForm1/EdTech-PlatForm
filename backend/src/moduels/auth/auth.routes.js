import {Router} from 'express'
import * as registrationServices from './auth.controller.js'
import  validation from '../../middleware/validation.js'
import * as validators from './auth.validation.js'
import { auth, authorization } from "../../middleware/auth.middleware.js";

const router=Router()

router.post('/signup', validation(validators.signupSchema), registrationServices.signup)
router.post('/confirm-email', validation(validators.confirmEmailSchema), registrationServices.confirmEmail)
router.post('/login', validation(validators.loginSchema), registrationServices.login)

// Admin management routes
router.get("/users", auth, authorization(['admin']), registrationServices.getUsers);
router.get("/users/:id", auth, authorization(['admin']), registrationServices.getUser);
router.put("/users/:id", auth, authorization(['admin']), registrationServices.updateUser);
router.delete("/users/:id", auth, authorization(['admin']), registrationServices.deleteUser);

export default router