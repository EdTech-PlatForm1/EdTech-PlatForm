import {Router} from 'express'
import * as registrationServices from './auth.controller.js'
import  validation from '../../middleware/validation.js'
import * as validators from './auth.validation.js'
const router=Router()

router.post('/signup',validation(validators.signup),registrationServices.signup)
router.post('/login',validation(validators.login),registrationServices.login)
router.get("/users", registrationServices.getUsers);
router.get("/users/:id", registrationServices.getUser);
router.put("/users/:id", registrationServices.updateUser);
router.delete("/users/:id", registrationServices.deleteUser);

export default router