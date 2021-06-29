import express from 'express';

const router = express.Router();

import { signup } from '../controllers/signup';
import { login } from '../controllers/login';
import { logout } from '../controllers/logout';
import { getCurrentUser } from '../controllers/currentUser';

import validateSignup from '../middlewares/request-validators/signupValidator';
import validateLogin from '../middlewares/request-validators/loginValidator';
import { handleValidationError } from '../middlewares/handleValidationError';
import { setCurrentUser } from '../middlewares/setCurrentUser';

router.post('/signup', validateSignup, handleValidationError, signup);
router.post('/login', validateLogin, handleValidationError, login);
router.post('/logout', logout);
router.get('/current-user', setCurrentUser, getCurrentUser);

export { router as authRouter };
