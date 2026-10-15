import express from 'express'
const routes = express.Router();
import {validate} from '../middleware/validate.js'
import {UserRequestSchema,UserLoginRequestSchema} from '../validators/user.validator.js'
import {UserSignup,Userlogin} from '../controllers/user.controller.js';

routes.use('/signup',validate(UserRequestSchema),UserSignup)

routes.use('/login',validate(UserLoginRequestSchema),Userlogin)

export default routes